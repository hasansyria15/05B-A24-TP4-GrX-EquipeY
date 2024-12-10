import { DATA_TACHES } from "./data-taches.js"; /*global google, bootstrap*/

function initialisation() {
 

    // Ajouter des écouteurs d'événements aux boutons
    /*
    document.getElementById('startTimerBtn').addEventListener('click', startTimer);
    document.getElementById('stopTimerBtn').addEventListener('click', stopTimer);
    document.querySelector('#taskModal .btn-close').addEventListener('click', resetTimer);*/
}

 function recupererTacheSelectionneeDansDiagrammeDeGantt(){

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

document.addEventListener("DOMContentLoaded", initialisation);