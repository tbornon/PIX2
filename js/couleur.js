var difficulty;
var timerLoop;
var timerPerdu;
var idCouleur;
var idCouleurPrecedent;
var peutAppuyer = false;
var score = -1;

var bestScore;
var bestScoreUser;  

const TEMPS_PERDU = 3000;
const COULEUR = ["Blanche", "Rouge", "Orange", "Jaune", "Verte", "Bleue", "Violette", "Rose", "Marron", "Noire"];

$(document).ready(function () {
    $('#yourScore').hide();
    $('#bestScore').hide();

    difficulty = document.location.pathname.replace('/couleur/', '');
    $('#perdu').hide();
    var socket = io('http://' + document.location.host + ':3000');

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

    $.ajax({
        url: '/api/score/couleur/1',
        success: function (data) {
            bestScore = data[0];
            $.ajax({
                url: '/api/user/' + bestScore.userId,
                success: function (user) {
                    bestScoreUser = user;
                }
            });
        }
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
    $('h1').hide();

    $('#yourScore').show();
    $('#bestScore').show();

    let data = {
        score: score,
        game: 'couleur'
    }

    $.ajax({
        url: "/api/score",
        type: 'POST',
        data: data,
        success: function (data) {
            if (data == "ok") console.log("saved");
            else console.error("err : " + data);
        }
    });

    if (bestScore != undefined && bestScore.score > data.score) {
        $('#yourScore p').text("Votre score : " + score);
        $('#bestScore p').text("Meilleur score : " + bestScore.score);
    } else {
        $('#yourScore p').text("Votre score : " + score);
        $('#bestScore p').text("Meilleur score : " + score);
    }
}