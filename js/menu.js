$(document).ready(function() {
    $.ajax({
        url: "/api/avatar",
        success: function(data) {
            console.log(data);
            showAvatar(data.seed, data.gender);
        }
    });

    $(".parametres").on('click', function() {
        document.location.href = "/parametres";
    });
})

function showAvatar(seed, gender) {
    var avatars;
    if (gender == "female")
        avatars = new Avatars(Avatars.SPRITE_SETS.female); // male, female, identicon
    else
        avatars = new Avatars(Avatars.SPRITE_SETS.male); // male, female, identicon

    avatars.create(seed, { size: 200 }, function (err, canvas) {
        if(err) console.error(err);
        $('#avatarImg').attr('src', canvas.toDataURL());
    });
}