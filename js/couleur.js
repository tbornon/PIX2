var difficulty;
var timerLoop;
var timerPerdu;
var idCouleur;
var idCouleurPrecedent;
var peutAppuyer = false;
var score = 0;

const TEMPS_PERDU = 2000;
const COULEUR = ["Blanche", "Rouge", "Orange", "Jaune", "Verte", "Bleue", "Violette", "Rose", "Marron", "Noire"];

$(document).ready(function () {
    difficulty = document.location.pathname.replace('/couleur/', '');
    $('#perdu').hide();
    var socket = io('http://localhost:3000');

    socket.on('keypressed', function (data) {
        if (peutAppuyer) {
            if(data.number == idCouleur) {
                jouer();
            } else {
                perdu();
            }
        }
    });

    $('.retour').on('click', function() {
        document.location.href="/";
    });

    jouer();
});

function jouer() {
    clearTimeout(timerPerdu);
    while(idCouleur == idCouleurPrecedent) idCouleur = Math.floor(Math.random() * Math.floor(10));
    idCouleurPrecedent = idCouleur;
    $("#affichage").text(COULEUR[idCouleur]);

    peutAppuyer = true;
    score++;
    $('#score p').text("Score : " + score);

    timerPerdu = setTimeout(function () {
        perdu();
    }, TEMPS_PERDU);
}

function perdu() {
    console.log("Vous avez perdu");
    peutAppuyer = false;
    clearInterval(timerLoop);
    clearTimeout(timerPerdu);
    $('#affichage').hide();
    $('#score').hide();
    $('.retour').hide();
    $('.perdu').show();
    $('#scorePerdu').text("Score :" + compteur)
    $('#retour').on('click', function () {
        document.location.href = "/";
    });
    $('#play').on('click', function () {
        console.log("Relance une partie");
    });
}