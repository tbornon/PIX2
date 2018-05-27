// liste des opérations mathématiques
var listeOperations = ["+", "-", "*"];
// temps pour que le joueur appuie avant de perdre (en ms)
const TempsPourAppuyer = 5000;
// est-ce que le joueur a le droit d'appuyer
var peutAppuyer = false;
// est ce que le joueur a perdu
var perdu = false;
// timer 
var timer;
// 2 chiffres pour l'opération
var chiffre1, chiffre2;
// réponse
var nombreattendu;
var resultat = ""
var compteur = 0
//à mettre ds boucles var chiffre1 = getRandomIntInclusive(0,9);
//à mettre ds boucles var chiffre2= getRandomIntInclusive(0,9);
var operateur;

    
// lorsque la page est chargée
$(document).ready(function () {

    // Connexion à la websocket pour récupérer les infos du clavier
    var socket = io('http://localhost:3000');
    $('#perdu').hide;
    // Génère les chiffres, l'opération et le résultat attendu
    genererPartie();
    $('#main').show;
    $('#perdu').show;

    // Lorsque l'on appuie sur une touche du clavier
    socket.on('keypressed', function (data) {
        if (!perdu) {
            console.log("data:", data)
            resultat += data.number
            if (resultat.length == nombreattendu.toString().length) {
                if (resultat == nombreattendu) {
                    console.log("Le resultat donné est :" + resultat);
                    console.log("Bien joué")
                    compteur++;
                    $('#score p').text("Score : " + compteur);
                    resultat = "";
                    genererPartie();
                }
                else {
                    console.log("perdu");
                    $('#score p').text("Score : " + 0);
                    compteur = 0;
                    perdu = true;
                    perdu();
                }
            }
        }
    });
    $('.return').on('click', function () {
        document.location.href = "/";
    });
});

// Génère un nombre aléatoire entre min et max (inclus)
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Choisis un opérateur au hasard
function genererOperateur(listeOpérations) {
    var operateur;
    var aleatoire = Math.random() * 3;
    console.log(aleatoire);
    if (aleatoire >= 0 && aleatoire < 1) operateur = listeOperations[0];
    else if (aleatoire >= 1 && aleatoire < 2) operateur = listeOperations[1];
    else if (aleatoire >= 2 && aleatoire <= 3) operateur = listeOperations[2];
    return operateur;
}

function genererPartie() {
    // Génére deux chiffres entre 0 et 9
    chiffre1 = getRandomIntInclusive(0, 9);
    chiffre2 = getRandomIntInclusive(0, 9);

    // Choisis l'opérateur
    operateur = genererOperateur(listeOperations);

    // Vérifie que le résultat le sois pas négatif
    if (chiffre1 < chiffre2 && operateur == "-") {
        let tampon = chiffre1
        chiffre1 = chiffre2
        chiffre2 = tampon
    }

    // Calcul le résultat attendu
    if (operateur == "+") {
        nombreattendu = chiffre1 + chiffre2
    }
    else if (operateur == "*") {
        nombreattendu = chiffre1 * chiffre2
    }
    else if (operateur == "-") {
        nombreattendu = chiffre1 - chiffre2
    }

    console.log("Nombre attendu est : " + nombreattendu);

    $("#main p").text(chiffre1 + " " + operateur + " " + chiffre2 + " = " + " ? ");
}

function perdu() {
    
}