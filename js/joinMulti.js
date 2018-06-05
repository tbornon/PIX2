var loadingTimer;
var compteur = 0;
var lookingForPlayerTimer;
var loadingTimer;

$(document).ready(function () {
    waiting("Recherche d'un adversaire")

    var socket = io('http://' + document.location.host + ':3000');

    lookingForPlayerTimer = setInterval(function () {
        socket.emit('multi', { msg: "LOOKING_FOR_PLAYER" });
    }, 1000);

    socket.on('multi', function(data) {
        console.log(data);
        if(data.msg == "CONNECTED") {
            console.log("Connected to a player");
            waiting("Connexion à l'adversaire")
            clearInterval(lookingForPlayerTimer);
        }
        else if(data.msg == "START_SIMON") {
            document.location.href = '/simonMulti';
        }
    });

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