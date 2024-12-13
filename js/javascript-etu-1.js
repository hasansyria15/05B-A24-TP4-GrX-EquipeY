import { DATA_TACHES } from "./data-taches.js"; 
import * as util from "./javascript-etu-2.js";
// import * as fctUtilitaires from "./fonctions-utilitaires.js";
/*global google, bootstrap*/


function initialisation() {
    google.charts.load("current", { "packages" : ["gantt"] });
    google.charts.setOnLoadCallback(() => {
        chargerEtAfficherDonneesDiagrammeEtCards();
        
    });
}


export let chart; 
export let data;

/**
 * @author | Hasan Al-dulaimi
 * @VERIFIER | IL FAUT INTEGRER AFFICHER CARDS DANS LE FONCTION chargerEtAfficherDonneesDiagrammeEtCards
 * Function pour afficher les données dans le diagramme et les cards
 */
function chargerEtAfficherDonneesDiagrammeEtCards() {
    data = creerDonneesPourGraphique();
    chart = new google.visualization.Gantt(document.getElementById("chart_div"));
    let options = {
        height: 275,
    };
    google.visualization.events.addListener(chart, 'select',util.recupererTacheSelectionneeDansDiagrammeDeGantt);
    chart.draw(data, options);
    afficherCardsTaches();

}
/**
 * @author : Hasan Al Dulaimi
 * function qui return un data table pour l'affichage
 * @returns {google.visualization.DataTable}
 */
function creerDonneesPourGraphique(){
    const data = new google.visualization.DataTable();
    DATA_TACHES.taches.forEach(tache => {
        data.addColumn(tache.type, tache.titreTache);
    });
     DATA_TACHES.detailsTache.forEach(tache => {
        const startDate = new Date(tache.dateDebut.getFullYear(), 
                                   tache.dateDebut.getMonth(), 
                                   tache.dateDebut.getDate());
        const endDate = new Date(tache.dateFin.getFullYear(), 
                                 tache.dateFin.getMonth(), 
                                 tache.dateFin.getDate());

        data.addRow([
            tache.id,
            tache.titre,
            startDate,
            endDate,
            tache.dureeEnNbJours,
            tache.pctComplete,
            tache.dependances ? tache.dependances.join(',') : null
        ]);
    });

    return data;
}
/**
 * 
 * @param {*} pImage 
 * @param {*} pTitre 
 * @param {*} pDescription 
 * @param {*} pEstAvecBouton 
 * @param {*} pElementHTMLBouton 
 * @returns 
 */
function creerCard(pImage, pTitre, pDescription, pEstAvecBouton = false, pElementHTMLBouton = '') {
    const card = document.createElement('div');
    card.classList.add('card', 'p-3', 'shadow-sm');
    card.style.width = '18rem';
    if (pImage) {
        const img = document.createElement('img');
        img.src = pImage;
        img.alt = pTitre || 'Image de la carte';
        img.classList.add('card-img-top');
        card.appendChild(img);
    }
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    if (pTitre) {
        const titre = document.createElement('h5');
        titre.classList.add('card-title');
        titre.textContent = pTitre;
        cardBody.appendChild(titre);
    }
    if (pDescription) {
        const description = document.createElement('p');
        description.classList.add('card-text');
        description.textContent = pDescription;
        cardBody.appendChild(description);
    }
    if (pEstAvecBouton && pElementHTMLBouton) {
        const boutonContainer = document.createElement('div');
        boutonContainer.innerHTML = pElementHTMLBouton; 
        cardBody.appendChild(boutonContainer.firstChild);
    }
    card.appendChild(cardBody);
    return card; 
}
/**
 * @author | Hasan Al-dulaimi 
 * Function pour afficher les cards des taches
 */
function afficherCardsTaches() {

    const taches = document.getElementById('taches');
    taches.textContent = '';
    taches.classList.add("d-flex", "flex-wrap", "gap-3");
    DATA_TACHES.detailsTache.forEach(tache => {
        const card = document.createElement('div');
        card.classList.add('card', 'p-3', 'shadow-sm');
        card.style.width = '18rem'; 
        const img = document.createElement('img');
        img.src = 'image/tache.jpeg';
        img.alt = "Task Icon";
        img.classList.add('card-img-top');
        card.appendChild(img);
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const titre = document.createElement('h5');
        titre.classList.add('card-title');
        titre.textContent = `${tache.id}: ${tache.titre}`;
        cardBody.appendChild(titre);
        const description = document.createElement('dl');
        for (let key in tache) {
            const dt = document.createElement('dt');
            dt.textContent = key;
            const dd = document.createElement('dd');
            dd.textContent = tache[key];
            description.appendChild(dt);
            description.appendChild(dd);
        }
        cardBody.appendChild(description);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', 'mt-2');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.setAttribute('data-id', tache.id); 
        deleteBtn.addEventListener('click', supprimerTache);
        cardBody.appendChild(deleteBtn);
        card.appendChild(cardBody);
        taches.appendChild(card);
    });
}
/**
 * @author : Abir Aymaz et Hasan Al Dulaimi
 * Supprimer une tâche dont le Id est spécifié dans un attribut HTML personnalisé « data-id »
 *  dans les données du graphique et réafficher les cards, puis redessiner le graphique
 * @param {*} e 
 * @returns 
 */
const supprimerTache = (e) => {
    const idTache = e.target.getAttribute('data-id');
    if (!idTache) {
        alert("ID de la tâche non trouvé !");
        return;
    }
    if (verifierSiDependanceExiste(idTache)) {
        alert("Impossible de supprimer cette tâche : elle a des dépendances !");
        return;
    }
    const cardElement = e.target.parentElement.parentElement; 
    if (cardElement) {
        cardElement.remove();
    }
    let indexTache = -1;
    for (let i = 0; i < data.getNumberOfRows(); i++) {
        if (data.getValue(i, 0) === idTache) {
            indexTache = i;
            break;
        }
    }

    if (indexTache === -1) {
        alert("Tâche introuvable dans les données !");
        return;
    }
    data.removeRow(indexTache);
    chart.draw(data);
    alert("Tâche supprimée avec succès !");
};

/**
 * @author | Hasan Al-dulaimi
 * fonction pour verfier si la tache a des dependances
 * @param {*} idTache 
 * @returns | retur vrai si la tache a des dependances
 */
function verifierSiDependanceExiste(idTache){
    for(let tache of DATA_TACHES.detailsTache){
        if(tache.dependances){
            if(tache.dependances.includes(idTache)){
                return true;
            }
        }
    }
    return false;
}

document.addEventListener("DOMContentLoaded", initialisation);