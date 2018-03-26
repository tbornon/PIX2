var step = 1;
var avatarCounterSeed = Math.random()*10;
var gender = "male";
var foregrounds = "blueFg pinkFg redFg orangeFg yellowFg greenFg blackFg";
var backgrounds = "blueBg pinkBg redBg orangeBg yellowBg greenBg blackBg";
var selectedColor = "blue";

$(document).ready(function() {
    $('.step2').hide();
    $('.step3').hide();
    $('.coloredBg').addClass(selectedColor + "Bg");
    $('.coloredFg').addClass(selectedColor + "Fg");
    
    /* CHANGER L'ETAPE */   
    $(".next").on('click', function(e) {
        $('.step' + step).hide();
        $('.step' + ++step).show(function() {
            if(step == 2) showAvatar(avatarCounterSeed, "male")
        }); 
    });

    /* CHOISIR UNE COULEUR */
    $(".pickColor").on('click', function(e) {
        $('.pickColor').removeClass('selected');
        selectedColor = e.target.id;
        $('.coloredBg').removeClass(backgrounds).addClass(selectedColor + "Bg");
        $('.coloredFg').removeClass(foregrounds).addClass(selectedColor + "Fg");
        $(e.target).addClass('selected');
    })

    /* BOUTONS NAVIGATION POUR LE CHOIX DE L'AVATAR */
    $('.step3 .navigation.right').on('click', function(e) {
        avatarCounterSeed++;
        showAvatar(avatarCounterSeed, gender);
    });

    $('.step3 .navigation.left').on('click', function(e) {
        if(avatarCounterSeed != 0) {
        avatarCounterSeed--;
        showAvatar(avatarCounterSeed, gender);
        }
    });

    /* CHOIX DU GENRE DE L'AVATAR */
    $('.step3 a').on('click', function(e) {
        $(e.target).addClass(selectedColor + "Bg")
        gender = e.target.id;
        if(e.target.id == "male") $('.step3 #female').removeClass(backgrounds)
        else if(e.target.id == "female") $('.step3 #male').removeClass(backgrounds)
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