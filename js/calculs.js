var listeOperations = ["+", "-", "*"];
var TempsPourAppuyer = 5000;
var peutAppuyer = false;
var perdu = false;
var timer;
var chiffre1, chiffre2;
var nombreattendu
var resultat=""
//à mettre ds boucles var chiffre1 = getRandomIntInclusive(0,9);
//à mettre ds boucles var chiffre2= getRandomIntInclusive(0,9);
var operateur;
$(document).ready(function() {
        chiffre1=getRandomIntInclusive(0,9);
        chiffre2=getRandomIntInclusive(0,9);
        operateur=genererOperateur(listeOperations);
        if(chiffre1<chiffre2 && operateur=="-")
        { var tampon=chiffre1
            chiffre1=chiffre2
            chiffre2=tampon}  
        if(operateur=="+")
        {
            nombreattendu=chiffre1+chiffre2
        }
        else if(operateur=="*")
        {
            nombreattendu=chiffre1*chiffre2
        }
        else if(operateur=="-")
        {
            nombreattendu=chiffre1-chiffre2
        }
        console.log("Nombre attendu est : "+nombreattendu);
        var socket=io('http://localhost:3000');
        $("#main p").text(chiffre1+" "+operateur+" "+chiffre2+" = "+ " ? ");
        socket.on('keypressed',function(data){
            console.log("data:",data)
            resultat+=data.number
            if(resultat.length==nombreattendu.tostring().length)
            {
                if(resultat==nombreattendu)
                {
                    console.log("LE resultat donné est :"+resultat);
                    console.log("Bien joué")
                    resultat="";
                }
                else{console.log("perdu")}
            }
            

        });

        
    });

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

function genererOperateur(listeOpérations) {
    var operateur;
    var aleatoire = Math.random() *3;
    console.log(aleatoire);
    if (aleatoire >= 0 && aleatoire < 1) operateur=listeOperations[0]// on ajoute bleu a la fin du tableau
    else if (aleatoire >= 1 && aleatoire < 2)operateur=listeOperations[1] // on ajoute jaune a la fin du tableau
    else if (aleatoire >= 2 && aleatoire <= 3) operateur=listeOperations[2];
    return operateur
}