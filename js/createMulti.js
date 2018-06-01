var loadingTimer;
var compteur = 0;

$(document).ready(function () {
    waiting("Création de la partie en cours")

    var socket = io('http://' + document.location.host + ':3000');

    socket.on('multi', function (data) {
        if (data.msg == "AP-ENABLED") {
            console.log("Serveur lancé");
            waiting("En attente d'un joueur");
        }
    });

    $('.return').on('click', function() {
        document.location.href="/";
    });
});

function waiting(msg) {
    clearInterval(loadingTimer);
    loadingTimer = setInterval(function () {
        var text = msg;
        compteur++;
        if (compteur == 4) compteur = 0;
        for (let i = 0; i < compteur; i++)
            text += ".";
        $("#loading").text(text)
    }, 500);
}