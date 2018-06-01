var loadingTimer;
var compteur = 0;

$(document).ready(function () {
    waiting("Recherche d'un adversaire")

    var socket = io('http://' + document.location.host + ':3000');

    $('.return').on('click', function () {
        document.location.href = "/";
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