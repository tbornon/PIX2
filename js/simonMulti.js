import { read } from "fs";

// liste avec les noms des couleurs
var listeCouleur = ["green", "red", "yellow", "blue"];
// liste des couleurs que le joueur doit retenir
var couleursAleatoires = [];

// temps que le joueur a pour appuyer sur la bonne touche (en ms)
const TEMPS_PERDU = 5000

// est ce que le joueur peut appuyer sur les touches
var peutAppuyer = false;
// est ce que la partie est perdue
var perdu = false;
// est ce que l'on est entrain d'afficher la séquence de couleurs à retenir
var affichageEnCours = false;

var readySignalReceived = false;

// timer pour vérifier que le joueur n'attend pas trop longtemps avant de jouer
var timer;
// timer qui s'actualise toutes les 100ms
var timerJeu;

var waitingForPlayerTimer;

// Avancement du joueur 
var indexJoueur = 0;

var bestScore;
var bestScoreUser;
var playerNumber;
var socket;

// La fonction s'éxécute lorsque la page est chargée
$(document).ready(function () {
    // Se connecte au serveur

    socket = io('http://' + document.location.host + ':3000');

    $.ajax({
        url: '/api/arch',
        success: function (data) {
            if (data == "raspberry") playerNumber = 1;
            else playerNumber = 2;
            handshake();
        }
    })

    // focntion éxécutée lorsque le serveur envoie un message de type "keypressed"
    socket.on('keypressed', function (data) {
        // on affiche les données reçues par le serveur
        console.log("data :", data);
        // si le joueur peut appuyer <=> si l'on n'est pas entrain d'afficher la séquence de couleurs
        if (peutAppuyer) {
            // on arrête le timer faisant perdre le joueur au bout de x secondes
            clearTimeout(timer);
            // Si le joueur a appuyé sur la bonne couleur
            if (couleursAleatoires[indexJoueur] == data.color) {
                // on passe à la couleur suivante
                indexJoueur++;
                console.log("Bonne couleur")
            } else { // Sinon la partie est perdue
                perdu = true;
                console.log("Mauvaise couleur")
            }

            // Si le joueur a saisi correctement toute la séquence de couleurs
            if (indexJoueur == couleursAleatoires.length) {
                // on remet l'index a 0
                indexJoueur = 0;
                console.log("Toutes les couleurs ont été saisies correctement, envoie d'une notification à l'adversaire");
                // on génère une nouvelle couleur et on affiche la séquence de couleurs
                socket.emit('simon', { msg: "YOUR_TURN", couleurs: couleursAleatoires });
            }
        }
    });

    socket.on('simon', function (data) {
        console.log("Simon data : " + data);
        if (data.msg == "READY" && data.number == 1 && !readySignalReceived) {
            console.log("Ready signal received from player 1");
            readySignalReceived = true;
            socket.emit('simon', { msg: "READY", number: playerNumber });
        }

        else if (data.msg == "READY" && data.number == 2 && !readySignalReceived) {
            console.log("Ready signal received from player 2");
            readySignalReceived = true;
            jouer();
        }

        else if (data.msg == "YOUR_TURN") {
            console.log("Your turn signal received");
            couleursAleatoires = data.couleurs;
            jouer();
        }
    });

    // on genère le timer qui vérifie si la partie est perdue toutes les 100ms
    timerJeu = setInterval(function () {
        if (perdu) {
            // On arrête le timer
            clearInterval(timerJeu);
            finPartie();
        }
    }, 100);

    $('.retour').on('click', function () {
        document.location.href = "/";
    });
});

function handshake() {
    console.log("Starting handshake : " + playerNumber);
    if (playerNumber == 1) {
        waitingForPlayerTimer = setInterval(function () {
            console.log("Sending ready signal");
            socket.emit('simon', { msg: "READY", number: playerNumber });
        }, 500);
    }


}

function jouer() {
    // on genère une nouvelle couleur
    genererCouleur(listeCouleur, couleursAleatoires);
    // on affiche un message contenant l'étape du jeu
    $('#score p').text("Score : " + couleursAleatoires.length);
    console.log("jouer(): étape " + couleursAleatoires.length);
    // on affiche la séquence de couleur
    afficherCouleurs(0);
}

function finPartie() {
    socket.emit('simon', { msg: "LOST", number: playerNumber });
}

function afficherCouleurs(index) {
    // on empêche le joueur d'appuyer sur les touches
    peutAppuyer = false;
    // on signale que l'affichage est en cours
    affichageEnCours = true;

    // on récupère la position de la couleur dans le tableau listeCouleur
    var indexCouleur = listeCouleur.indexOf(couleursAleatoires[index]);
    // on ajoute la class allume à la couleur position indexCouleur
    $(".bloc#" + listeCouleur[indexCouleur]).css('opacity', '0.3');
    // au bout de 500ms
    setTimeout(function () {
        // on enlève la class allume à tous les éléments de class bloc
        $(".bloc").css('opacity', '1');
        // au bout de de 100ms
        setTimeout(function () {
            // si on ne sort pas du tableau <=> si il reste des couleurs à afficher
            if (index + 1 < couleursAleatoires.length) {
                // on affiche la couleur suivante
                afficherCouleurs(index + 1);
            } else {
                // sinon le joueur peut à nouveau appuyer
                peutAppuyer = true;
                // s'il n'appuie pas sur une touche dans les 5s, il a perdu
                timer = setTimeout(function () { perdu = true; }, TEMPS_PERDU);
            }
        }, 100);
    }, 500);

}

// fonction qui génère une nouvelle couleur aléatoire venant du tableau listeCouleur et l'ajoute
// au tableau couleursAleatoires
function genererCouleur(listeCouleur, couleursAleatoires) {
    var aleatoire = Math.random() * 4;
    if (aleatoire >= 0 && aleatoire < 1) couleursAleatoires.push(listeCouleur[3]) // on ajoute bleu a la fin du tableau
    else if (aleatoire >= 1 && aleatoire < 2) couleursAleatoires.push(listeCouleur[2]) // on ajoute jaune a la fin du tableau
    else if (aleatoire >= 2 && aleatoire < 3) couleursAleatoires.push(listeCouleur[1]) // on ajoute rouge a la fin du tableau
    else couleursAleatoires.push(listeCouleur[0]) // on ajoute vert a la fin du tableau
}