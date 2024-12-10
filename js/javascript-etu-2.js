import { DATA_TACHES } from "./data-taches.js"; /*global google, bootstrap*/
import { chart } from './javascript-etu-1.js';

export function recupererTacheSelectionneeDansDiagrammeDeGantt(){

    const selection =  chart.getSelection();

    if(selection.length > 0){
        
        if(chart !== null){
        //Récupérer l'index de la tâche sélectionnée
          const indexTache = selection[0].row;

        // Extraire les données de la tâche à partir du DataTable
        const tache = DATA_TACHES.detailsTache[indexTache];

        // Remplir la modal avec les détails de la tâche
        document.getElementById('idTache').value = tache.id;
        document.getElementById('titreTache').value = tache.titre;
        document.getElementById('dateDebut').value = formatDate(tache.dateDebut);
        document.getElementById('dateFin').value = formatDate(tache.dateFin);
        document.getElementById('dureeTache').value = tache.dureeEnNbJours;
        document.getElementById('taskPctComplete').value = tache.pctComplete;
        document.getElementById('tacheDependance').value = tache.dependances ? tache.dependances.join(', ') : '';

        // Afficher la modal 
        const modal = new bootstrap.Modal(document.getElementById('taskModal'));
        modal.show();

        }

    } else{
        alert('Aucune tâche sélectionnée !');
    }
    
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
// /**
//  * @author | Hasan Al-dulaimi
//  * function pour demarrer la minuterie
//  */
// function calculerAvancement(){
//     // Obtenir la durée totale estimée
//     const dureeEstimee = parseInt(document.getElementById('dureeTache').value, 10);

//     if(joursRealises < dureeEstimee){
        
//         // Incrémenter les jours réalisés
//         joursRealises++;

        
//         //Calculer le pourcentage d'avancement
//         const pctComplete = Math.round((joursRealises / dureeEstimee) * 100);

//         // Mettre à jour le champ de pourcentage complété
//         document.getElementById("realisationTemps").textContent = `${joursRealises}`;


//         // Mettre à jour l'affichage du champ % d'avancement
//         document.getElementById('taskPctComplete').value = pctComplete;

//         // Mettre à jour la barre de progression
//         const progressBar = document.querySelector(".progress-bar");
//         progressBar.style.width = `${pctComplete}%`;
//         progressBar.textContent = `${pctComplete}%`;

//         // Ajouter une classe pour l'animation si nécessaire
//         progressBar.classList.add("progress-bar-animated");
//     } 
// }
// /**
//  * @author | Hasan Al-dulaimi
//  * function pour arreter la minuterie
//  */
// function arreterMinuterie() {
//     if (temps) { // Vérifie si un timer est actif
//         clearInterval(temps); // Arrête la minuterie
//         temps = null; // Réinitialise la variable du timer
//         alert("Minuterie arrêtée !");
//     } else {
//         alert("Aucune minuterie en cours !");
//     }
// }

// // Ajouter les événements pour démarrer et arrêter la minuterie
// document.getElementById('startTimer').addEventListener('click', calculerAvancement);
// document.getElementById('stopTimer').addEventListener('click', arreterMinuterie);
let timer; // Variable pour la minuterie
let joursRealises = 0; // Jours simulés
let joursEstimes = 0; // Nombre de jours estimés pour terminer la tâche

// Fonction pour démarrer la minuterie
function calculerAvancement() {
  // Récupérer la durée estimée depuis le champ "dureeTache"
  joursEstimes = parseInt(document.getElementById('dureeTache').value, 10);

  if (isNaN(joursEstimes) || joursEstimes <= 0) {
    alert('Veuillez entrer une durée valide pour la tâche.');
    return;
  }

  // Activer le bouton "Stop" et désactiver "Start"
  document.getElementById('startTimerBtn').disabled = true;
  document.getElementById('stopTimerBtn').disabled = false;

  // Mettre à jour la minuterie toutes les secondes
  timer = setInterval(() => {
    joursRealises++;

    // Calculer le pourcentage d'avancement
    const pourcentage = Math.min((joursRealises / joursEstimes) * 100, 100);

    // Mettre à jour le champ "Réalisation"
    document.getElementById('taskPctComplete').value = joursRealises;

    // Mettre à jour la barre de progression (progress-bar)
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${pourcentage}%`;
      progressBar.textContent = `${Math.floor(pourcentage)}%`;
    }

    // Si l'avancement atteint 100 %, arrêter la minuterie
    if (pourcentage >= 100) {
      clearInterval(timer);
      alert('Tâche terminée !');
      document.getElementById('startTimerBtn').disabled = false;
      document.getElementById('stopTimerBtn').disabled = true;
    }
  }, 1000); // 1 seconde = 1 jour
}

// Fonction pour arrêter la minuterie
function arreterMinuterie() {
  clearInterval(timer);

  // Réinitialiser les boutons
  document.getElementById('startTimerBtn').disabled = false;
  document.getElementById('stopTimerBtn').disabled = true;

  console.log('Minuterie arrêtée.');
}
// Événement pour démarrer la minuterie
document.getElementById('startTimerBtn').addEventListener('click', calculerAvancement);

// Événement pour arrêter la minuterie
document.getElementById('stopTimerBtn').addEventListener('click', arreterMinuterie);
