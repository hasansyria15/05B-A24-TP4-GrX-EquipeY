import { DATA_TACHES } from "./data-taches.js"; /*global google, bootstrap*/
import { chart } from "./javascript-etu-1.js";
import { data } from "./javascript-etu-1.js";
/**
 * @author : Abir Aymaz
 * Fonction qui permet d'ouvrir la fenêtre modale et d'afficher les informations
 */
export function recupererTacheSelectionneeDansDiagrammeDeGantt() {
  const selection = chart.getSelection();
  if (selection.length > 0) {
    if (chart !== null) {
      const indexTache = selection[0].row;
      const tache = DATA_TACHES.detailsTache[indexTache];
      document.getElementById("idTache").value = tache.id;
      document.getElementById("titreTache").value = tache.titre;
      document.getElementById("dateDebut").value = formatDate(tache.dateDebut);
      document.getElementById("dateFin").value = formatDate(tache.dateFin);
      document.getElementById("dureeTache").value = tache.dureeEnNbJours;
      document.getElementById("avancement").value = tache.pctComplete;
      document.getElementById("tacheDependance").value = tache.dependances
        ? tache.dependances.join(", ")
        : "";
      const modal = new bootstrap.Modal(document.getElementById("taskModal"));
      modal.show();
    }
  } 
}

/**
 * function pour recupéré le date
 * @param {*} date
 * @returns
 */
function formatDate(date) {
  if (!date) 
    return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
let timer; 
let joursRealises = 0;
let joursEstimes = 0; 

/**
 * @author Abir Aymaz
 * Cette fonction est appelée par une minuterie aux secondes. Elle compte les secondes et les affiche dans le champ Réalisation.
 */
function calculerAvancement() {
  joursEstimes = parseInt(document.getElementById("dureeTache").value, 10);
  document.getElementById("startTimerBtn").disabled = true;
  document.getElementById("stopTimerBtn").disabled = false;
  timer = setInterval(() => {
    joursRealises++;
    const pourcentage = Math.min((joursRealises / joursEstimes) * 100, 100);
    document.getElementById("taskPctComplete").value = joursRealises;
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.style.width = `${pourcentage}%`;
      progressBar.textContent = `${Math.floor(pourcentage)}%`;
    }
    if (pourcentage >= 100) {
      clearInterval(timer);
      alert("Tâche terminée !");
      document.getElementById("startTimerBtn").disabled = false;
      document.getElementById("stopTimerBtn").disabled = true;
    }
  }, 1000);
}
/**
 * @author Abir Aymaz
 * Fonction qui arrête la minuterie
 */
function arreterMinuterie() {
  clearInterval(timer);
  document.getElementById("startTimerBtn").disabled = false;
  document.getElementById("stopTimerBtn").disabled = true;
}

/**
 * Sauvegarde les modifications de la tâche dans le DataTable et redessine le diagramme de Gantt.
 */
const sauvegarderChangementsTache = () => {
  const selection = chart.getSelection();
  if (selection.length === 0) {
    alert("Veuillez sélectionner une tâche à modifier.");
    return;
  }
  const indexTache = selection[0].row;
  const id = document.getElementById("idTache").value;
  const titre = document.getElementById("titreTache").value;
  const dateDebut = new Date(document.getElementById("dateDebut").value);
  const dateFin = new Date(document.getElementById("dateFin").value);
  const duree = convertirJoursEnMillisecondes(
    parseInt(document.getElementById("dureeTache").value, 10)
  );
  const pctComplete = parseInt(
    document.getElementById("taskPctComplete").value,
    10
  );
  const dependancesInput = document.getElementById("tacheDependance").value;
  const dependances = [];
  const tabDepandance = dependancesInput.split(",");
  for (let dep of tabDepandance) {
    const depTrime = dep.trim();
    if (depTrime) {
      dependances.push(depTrime);
    }
  }
  if (data && chart) {
    data.setValue(indexTache, 0, id);
    data.setValue(indexTache, 1, titre);
    data.setValue(indexTache, 2, dateDebut);
    data.setValue(indexTache, 3, dateFin);
    data.setValue(indexTache, 4, duree);
    data.setValue(indexTache, 5, pctComplete);
    data.setValue(indexTache, 6, dependances.join(","));
    chart = new google.visualization.Gantt(document.getElementById("chart_div"));
    chart.draw(data);
  }
};
document
  .getElementById("btnSauvegarder")
  .addEventListener("click", sauvegarderChangementsTache);
document
  .getElementById("startTimerBtn")
  .addEventListener("click", calculerAvancement);
document
  .getElementById("stopTimerBtn")
  .addEventListener("click", arreterMinuterie);
