/**
 * Convertit un nombre de jours en millisecondes.
 * @param {number} pNbJours - Nombre de jours à convertir.
 * @returns {number} - Nombre de millisecondes correspondant.
 */
export function convertirJoursEnMillisecondes(pNbJours) {
    return pNbJours * 24 * 60 * 60 * 1000;
}
/**
 * Convertit un nombre de millisecondes en jours.
 * @param {number} pNbMillisecondes - Nombre de millisecondes à convertir.
 * @returns {number} - Nombre de jours correspondant.
 */
export function convertirMillisecondesEnJours(pNbMillisecondes) {
    return pNbMillisecondes / 24 * 60 * 60 * 1000;
}