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
    $.ajax({
        url: "/api/avatar",
        success: function (data) {
            console.log(data);
            showAvatar(data.seed, data.gender);
        }
    });

    $.ajax({
        url: "/api/name",
        success: function(data) {
            console.log(data);
            $("#pseudo p").text(data.name);
        }
    })

    $('#Simon').css("display", "block");
    $('#boutonSimon').addClass("active") ;

    $('#return').on('click', function() {
        document.location.href = "/"
    })
});

function showAvatar(seed, gender) {
    var avatars;
    if (gender == "female")
        avatars = new Avatars(Avatars.SPRITE_SETS.female); // male, female, identicon
    else
        avatars = new Avatars(Avatars.SPRITE_SETS.male); // male, female, identicon

    avatars.create(seed, { size: 50 }, function (err, canvas) {
        if (err) console.error(err);
        $('#avatarImg').attr('src', canvas.toDataURL());
    });
}