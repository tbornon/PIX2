var listeOperations = ["+", "-", "*"];
var TempsPourAppuyer = 5000;
var peutAppuyer = false;
var Perdu = false;
var timer;
//à mettre ds boucles var chiffre1 = getRandomIntInclusive(0,9);
//à mettre ds boucles var chiffre2= getRandomIntInclusive(0,9);
var operateur;







function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

function genererCouleur(listeOpérations, operateur) {
    var aleatoire = Math.random() *3;
    if (aleatoire >= 0 && aleatoire < 1) operateur=listeOperations[0]// on ajoute bleu a la fin du tableau
    else if (aleatoire >= 1 && aleatoire < 2)operateur=listeOperations[1] // on ajoute jaune a la fin du tableau
    else if (aleatoire >= 2 && aleatoire <= 3) operateur=listeOperations[2];
}