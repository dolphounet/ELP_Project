const fs = require('fs');
var file = require('./file');

// Déclaration de la variable globale pour stocker dico
var contenuFichier;

// Lecture du dico et stockage de son contenu en var globale
try {
  contenuFichier = fs.readFileSync('liste_francais.txt', 'utf8');
  console.log("Contenu du dictionnaire bien stocké dans la variable globale");
  
} catch (err) {
  console.error("Erreur de lecture du fichier :", err);
};


function verifs(){
// ################ VERIF ####################

    function validstr(word){
        if (word.length>9){
        console.log("le mot ne doit pas dépasser 9 caractères.");
        file.log("log", "Joueur " + joueur+1 + " : le mot ne doit pas dépasser 9 caractères")
        .then(() => resolve())
        .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
        return false
        }
        else if (word.length < 3){
        console.log("Le mot doit être supérieur à trois caractères.");
        file.log("log", "Joueur " + joueur+1 + " : le mot doit être supérieur à trois caractères")
        .then(() => resolve())
        .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
        return false
        }
        return true;
    }
  
    function anagram(word,newWord,carpet) {
    // Initialisation
    newWord = newWord.toUpperCase()
    word = word.toUpperCase()

    // Test de la présence du mots dans la nouvelle propal
    for (let i = 0; i < word.length; i++) {
        if (newWord.includes(word[i])){
        newWord = newWord.replace(word[i], '');
        }
        else {
        return false
        };
    };

    // Test si les lettres restantes sont sur le tapis
    for(let i=0;i<6;i++) {
        let letter = String.fromCharCode(carpet[i] + 65);
        if (newWord.includes(letter)) {newWord = newWord.replace(letter,'')}
    };

    if (newWord !== '') {return false};
    return true
    }

    // Fonction de vérification du mot dans le dictionnaire
    function verifmotinDico(mot){

        if (contenuFichier.includes(mot)) {
            console.log("Le mot est bien présent dans le dictionnaire");
        file.log("log", "Le mot est bien présent dans le dictionnaire")
        .then(() => resolve())
        .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
            return true;
        }
        console.log("Le mot n'est pas présent dans le dictionnaire");
        file.log("log", "Le mot n'est pas présent dans le dictionnaire")
        .then(() => resolve())
        .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
        avis = file.input("Acceptez-vous tout de meme ce mot ?(oui/non)",["oui","non"]);
        if (avis==="oui"){
          file.log("log", "Le mot est tout de même accepté par le joueur")
          .then(() => resolve())
          .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
          return true;
        };
        return false
    };
    
    this.verifMot= function(word,newWord,carpet){
        verified = anagram(word,newWord,carpet) && validstr(newWord) && verifmotinDico(newWord);
        return verified
    };
}

module.exports = new verifs;
