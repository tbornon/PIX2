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

    document.getElementById(nomJeu).style.display = "block";
    evenement.currentTarget.className += " active";
}

window.onload = function(){
    document.getElementById('Simon').style.display = "block";
    document.getElementById('boutonSimon').classList.add("active") ;
};