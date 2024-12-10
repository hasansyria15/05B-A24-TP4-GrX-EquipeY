import { DATA_TACHES } from "./data-taches.js"; 
import * as util from "./javascript-etu-2.js";
import * as fctUtilitaaires from "./fonctions-utilitaires.js";
/*global google, bootstrap*/


function initialisation() {
    google.charts.load("current", { "packages" : ["gantt"] });
    google.charts.setOnLoadCallback(() => {
        chargerEtAfficherDonneesDiagrammeEtCards();
        
    });

    // Ajouter des écouteurs d'événements aux boutons
    /*
    document.getElementById('startTimerBtn').addEventListener('click', startTimer);
    document.getElementById('stopTimerBtn').addEventListener('click', stopTimer);
    document.querySelector('#taskModal .btn-close').addEventListener('click', resetTimer);*/
}


let chart; // Déclaré globalement pour être accessible dans toute la portée
let data;  // Déclaré globalement pour être accessible dans toute la portée

/**
 * @author | Hasan Al-dulaimi
 * @VERIFIER | IL FAUT INTEGRER AFFICHER CARDS DANS LE FONCTION chargerEtAfficherDonneesDiagrammeEtCards
 * Function pour afficher les données dans le diagramme et les cards
 */
function chargerEtAfficherDonneesDiagrammeEtCards() {

    // 1. Créer le DataTable avec les données
    data = creerDonneesPourGraphique();

    // 2. Configurer le diagramme de Gantt
    chart = new google.visualization.Gantt(document.getElementById("chart_div"));

    let options = {
        height: 275, // Taille du graphique
    };

    //Ajouter l'événement de sélection
    google.visualization.events.addListener(chart, 'select',util.recupererTacheSelectionneeDansDiagrammeDeGantt);
    // Dessiner le graphique
    chart.draw(data, options);

    //Appeler la fonction pour afficher les cards
    afficherCardsTaches();

}


/**
 * function qui return un data table pour l'affichage
 * @returns {google.visualization.DataTable}
 */
function creerDonneesPourGraphique(){

    // Création du tableau de données
    const data = new google.visualization.DataTable();

    //Ajouter des colonnes nécessaires
    DATA_TACHES.taches.forEach(tache => {
        data.addColumn(tache.type, tache.titreTache);
    });

    //Ajouter des lignes a partir de DATA_TACHES
     // Ajouter les lignes
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
 * @author | Hasan Al-dulaimi
 * Function pour afficher les cards des taches
 */
function afficherCardsTaches(){
    const taches = document.getElementById('taches');

    taches.classList.add("d-flex", "flex-wrap", "gap-3");

    // Vider le conteneur avant de réafficher

    DATA_TACHES.detailsTache.forEach(tache => {
        //Créer une card Bootstrap
        const card = document.createElement('div');

        //Ajouter les classes Bootstrap
        card.classList.add('card', 'p-3', 'shadow-sm');

        //Ajouter le width de card
        card.style.width = '18rem';

        // //Ajouter une image à la card
        // const img = document.createElement('img');
        // img.src = 'img/task.png';
        // img.alt = "Task Icon";
        // img.classList.add('card-img-top');
        // card.appendChild(img);

        //Ajouter le contenu de la card
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const titre = document.createElement('h5');
        titre.classList.add('card-title');
        titre.textContent = `${tache.id}: ${tache.titre}`;
        cardBody.appendChild(titre);

        const description = document.createElement('dl');
        for(let key in tache){
            const dt = document.createElement('dt');
            dt.textContent = key;

            const dd = document.createElement('dd');

            dd.textContent = tache[key];

            description.appendChild(dt);
            description.appendChild(dd);
        }
        cardBody.appendChild(description);

        //Bouton de suppression
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-danger', "mt-2");
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.setAttribute("data-id", tache.id); // Attribut personnalisé pour identifier la tâche
        //deleteBtn.addEventListener('click', () => supprimerTache(tache.id));
        cardBody.appendChild(deleteBtn);

        card.appendChild(cardBody);


        //Ajouter la card au conteneur
        taches.appendChild(card);

    })

}

/**
 * @author | Hasan Al-dulaimi
 * fonction pour verfier si la tache a des dependances
 * @param {*} idTache 
 * @returns | retur vrai si la tache a des dependances
 */
function verfierSiDependancesExistent(idTache){

    //parcourir les taches
    for(let tache of DATA_TACHES.detailsTache){
        if(tache.dependances){
            if(tache.dependances.includes(idTache)){
                return true;
            }
        }
    }

    return false;
    
}



/**
 * function pour recupéré le date
 * @param {*} date 
 * @returns 
 */
function formatDate(date) { // il faut voir ca avec abir
    if(!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

let temps; // Variable pour stocker l'identifiant du timer
let joursRealises = 0; // Variable pour stocker le nombre de jours réalisés

/**
 * @author | Hasan Al-dulaimi
 * function pour demarrer la minuterie
 */
function calculerAvancement(){
    // Obtenir la durée totale estimée
    const dureeEstimee = parseInt(document.getElementById('taskDuree').value, 10);

    if(joursRealises < dureeEstimee){
        
        // Incrémenter les jours réalisés
        joursRealises++;

        
        //Calculer le pourcentage d'avancement
        const pctComplete = Math.round((joursRealises / dureeEstimee) * 100);

        // Mettre à jour le champ de pourcentage complété
        document.getElementById("realisationTemps").textContent = `${joursRealises}`;


        // Mettre à jour l'affichage du champ % d'avancement
        document.getElementById('taskPctComplete').value = pctComplete;

        // Mettre à jour la barre de progression
        const progressBar = document.querySelector(".progress-bar");
        progressBar.style.width = `${pctComplete}%`;
        progressBar.textContent = `${pctComplete}%`;

        // Ajouter une classe pour l'animation si nécessaire
        progressBar.classList.add("progress-bar-animated");
    } 
}

/**
 * @author | Hasan Al-dulaimi
 * function pour arreter la minuterie
 */
function arreterMinuterie() {
    if (temps) { // Vérifie si un timer est actif
        clearInterval(temps); // Arrête la minuterie
        temps = null; // Réinitialise la variable du timer
        alert("Minuterie arrêtée !");
    } else {
        alert("Aucune minuterie en cours !");
    }
}

/**
 * @author | Hasan Al-dulaimi
 * function pour sauvegarder les modifications
 */
function sauvegarderChangementsTache() {
    // Obtenir l'index de la tâche sélectionnée dans le diagramme
    const selection = chart.getSelection(); // Assurez-vous que `chart` est défini globalement

    if (selection.length > 0) {
        const indexTache = selection[0].row; // Index de la tâche sélectionnée

        // Récupérer les données modifiées depuis le formulaire/modal
        const id = document.getElementById("taskId").value;
        const titre = document.getElementById("taskTitre").value;
        const dateDebut = new Date(document.getElementById("taskDateDebut").value);
        const dateFin = new Date(document.getElementById("taskDateFin").value);
        const duree = parseInt(document.getElementById("taskDuree").value, 10);
        const pctComplete = parseInt(document.getElementById("taskPctComplete").value, 10);
        const dependances = document.getElementById("taskDependances").value
            .split(",")
            .map(dep => dep.trim());

        // Mettre à jour le DataTable
        data.setValue(indexTache, 0, id);
        data.setValue(indexTache, 1, titre);
        data.setValue(indexTache, 2, dateDebut);
        data.setValue(indexTache, 3, dateFin);
        data.setValue(indexTache, 4, duree);
        data.setValue(indexTache, 5, pctComplete);
        data.setValue(indexTache, 6, dependances.join(","));

        // Rafraîchir le graphique
        chart.draw(data);

        alert("Les changements ont été sauvegardés avec succès !");
    } else {
        alert("Aucune tâche sélectionnée pour la modification !");
    }
}



document.addEventListener("DOMContentLoaded", initialisation);