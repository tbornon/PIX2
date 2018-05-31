$(document).ready(function() {
    $('.return').on('click', function() {
        document.location.href="/";
    });

    $('#simon').on('click', function() {
        document.location.href = "/simon/";
    });

    $('#couleur').on('click', function() {
        document.location.href = "/couleur/";
    });

    $('#calcul').on('click', function() {
        document.location.href = "/calculs/";
    });
})