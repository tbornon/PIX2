var step = 1;
var avatarCounterSeed = 0;
var gender = "male";

$(document).ready(function() {
    $('.step2').hide();
    
    /* CHANGER L'ETAPE */   
    $(".next").on('click', function(e) {
        $('.step' + step).hide();
        $('.step' + ++step).show(function() {
            if(step == 2) showAvatar(avatarCounterSeed, "male")
        }); 
    })

    /* BOUTONS NAVIGATION POUR LE CHOIX DE L'AVATAR */
    $('.step2 .navigation.right').on('click', function(e) {
        if(avatarCounterSeed == 0) $('.step2 .navigation.left').removeClass('grayed');
        avatarCounterSeed++;
        showAvatar(avatarCounterSeed, gender);
    });

    $('.step2 .navigation.left').on('click', function(e) {
        if(avatarCounterSeed == 1) $('.step2 .navigation.left').addClass('grayed');
        if(avatarCounterSeed != 0) {
        avatarCounterSeed--;
        showAvatar(avatarCounterSeed, gender);
        }
    });

    /* CHOIX DU GENRE DE L'AVATAR */
    $('.step2 a').on('click', function(e) {
        $(e.target).addClass('selected')
        gender = e.target.id;
        if(e.target.id == "male") $('.step2 #female').removeClass('selected')
        else if(e.target.id == "female") $('.step2 #male').removeClass('selected')
        showAvatar(avatarCounterSeed, gender);
    });


});

/* Génère un avatar et l'affiche en fonction d'une seed et d'un genre donné */
function showAvatar(seed, gender) {
    var avatars;
    if(gender == "female")
        avatars= new Avatars(Avatars.SPRITE_SETS.female); // male, female, identicon
    else
        avatars= new Avatars(Avatars.SPRITE_SETS.male); // male, female, identicon
    
    avatars.create(seed, {size: 200}, function(err, canvas) {
        $('#avatar').attr('src', canvas.toDataURL());
    });
}