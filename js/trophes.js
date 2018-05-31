function ouvrirOnglet(evenement, nomJeu) {
    var i, lienOnglet, contenuOnglet;

    contenuOnglet = document.getElementsByClassName("contenuOnglet");
    for (i = 0; i < contenuOnglet.length; i++) {
        contenuOnglet[i].style.display = "none";
    }

    lienOnglet = document.getElementsByClassName("lienOnglet");
    for (i = 0; i < lienOnglet.length; i++) {
        lienOnglet[i].className = lienOnglet[i].className.replace(" active", "");
    }

    $("#" + nomJeu).css("display", "block");
    evenement.currentTarget.className += " active";
}

$(document).ready(function() {
    $('#Simon').css("display", "block");
    $('#boutonSimon').addClass("active") ;

    $('#return').on('click', function() {
        document.location.href = "/"
    })
});
