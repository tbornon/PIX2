var step = 1;
var avatarCounterSeed = Math.random() * 10;
var gender = "male";


$(document).ready(function () {
    $('.coloredBg').addClass(selectedColor + "Bg");
    $('.coloredFg').addClass(selectedColor + "Fg");
    showAvatar(avatarCounterSeed, "male");

    /* BOUTONS NAVIGATION POUR LE CHOIX DE L'AVATAR */
    $('.avatar .navigation.right').on('click', function (e) {
        avatarCounterSeed++;
        showAvatar(avatarCounterSeed, gender);
    });

    $('.avatar .navigation.left').on('click', function (e) {
        if (avatarCounterSeed != 0) {
            avatarCounterSeed--;
            showAvatar(avatarCounterSeed, gender);
        }
    });

    /* CHOIX DU GENRE DE L'AVATAR */
    $('.avatar a').on('click', function (e) {
        $(e.target).addClass(selectedColor + "Bg")
        gender = e.target.id;
        if (e.target.id == "male") $('.avatar #female').removeClass(backgrounds)
        else if (e.target.id == "female") $('.avatar #male').removeClass(backgrounds)
        showAvatar(avatarCounterSeed, gender);
    });

    $(".next").on('click', function() {
        $.ajax({
            url: "/api/avatar",
            type: "POST",
            data: { "gender": gender, "seed": avatarCounterSeed},
            success: function(data) {
                if(data == "ok") {                    
                    if(document.referrer == "http://localhost/parametres")
                        document.location.href = "/";
                    else
                        document.location.href = "/";
                } else {
                    console.error("Invalid answer : " + data);
                }
            }
        })
    })
});

/* Génère un avatar et l'affiche en fonction d'une seed et d'un genre donné */
function showAvatar(seed, gender) {
    var avatars;
    if (gender == "female")
        avatars = new Avatars(Avatars.SPRITE_SETS.female); // male, female, identicon
    else
        avatars = new Avatars(Avatars.SPRITE_SETS.male); // male, female, identicon

    avatars.create(seed, { size: 200 }, function (err, canvas) {
        $('#avatar').attr('src', canvas.toDataURL());
    });
}