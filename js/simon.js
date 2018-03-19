var listeCouleur = ["green", "red", "yellow", "blue"];
var couleursAleatoires = [];

var peutAppuyer = false;
var perdu = false;
var affichageEnCours = false;

var timer;
var timerJeu;

var indexJoueur = 0; // Avancement du joueur 

$(document).ready(function () {
    var socket = io('http://localhost:3000');

    timerJeu = setInterval(function () {
        if (perdu) {
            alert("Tu as perdu");
            clearInterval(timerJeu);
        }
    }, 100);

    socket.on('keypressed', function (data) {
        console.log("data :", data);
        console.log(peutAppuyer)
        if (peutAppuyer) {
            clearTimeout(timer);
            if (couleursAleatoires[indexJoueur] == data.color) {
                indexJoueur++;
                console.log("Bonne couleur")
            } else {
                perdu = true;
                console.log("Mauvaise couleur")
            }

            if (indexJoueur == couleursAleatoires.length) {
                indexJoueur = 0;
                jouer();
            }
        }
    })
    jouer();


});

function jouer() {
    genererCouleur(listeCouleur, couleursAleatoires);
    console.log("jouer(): étape " + couleursAleatoires.length);
    afficherCouleurs(0);

}

function afficherCouleurs(index) {
    peutAppuyer = false;
    affichageEnCours = true;

    var indexCouleur = listeCouleur.indexOf(couleursAleatoires[index]);
    $(".bloc#" + listeCouleur[indexCouleur]).addClass("allume");
    console.log(listeCouleur[indexCouleur]);
    setTimeout(function () {
        $(".bloc").removeClass("allume");
        setTimeout(function () {
            if (index + 1 < couleursAleatoires.length) {
                afficherCouleurs(index + 1);
            } else {
                peutAppuyer = true;
                timer = setTimeout(function () { perdu = true; }, 5000);
            }
        }, 100);
    }, 600);

}

function genererCouleur(listeCouleur, couleursAleatoires) {
    var aleatoire = Math.random() * 4;
    if (aleatoire >= 0 && aleatoire < 1) couleursAleatoires.push(listeCouleur[3]) // on ajoute bleu a la fin du tableau
    else if (aleatoire >= 1 && aleatoire < 2) couleursAleatoires.push(listeCouleur[2]) // on ajoute jaune a la fin du tableau
    else if (aleatoire >= 2 && aleatoire < 3) couleursAleatoires.push(listeCouleur[1]) // on ajoute rouge a la fin du tableau
    else couleursAleatoires.push(listeCouleur[0]) // on ajoute vert a la fin du tableau
}