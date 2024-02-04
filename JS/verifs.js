const fs = require('fs');
var file = require('./file');

var contenuFichier;
try {
  let contenu = fs.readFileSync('liste_francais.txt', 'utf8').toLowerCase();
  contenuFichier = contenu.split("\n")
  console.log("Contenu du dictionnaire bien stocké dans la variable globale");
  
} catch (err) {
  console.error("Erreur de lecture du fichier :", err);
};


function verifs(){
// ################ VERIF ####################

  function anagram(word,newWord,carpet) {
    // Teste si le nouveau mot est composé du mot actuel et du tapis
    newWord = newWord.toUpperCase()
    word = word.toUpperCase()
    if (word.length >= newWord.length) {
      console.log("Il faut jouer toutes les lettres du mot présent sur la grille et en rajouter depuis le tapis")
      file.register("Le mot joué n'ajoute pas de lettres par rapport au mot déjà présent sur la grille")
      return false
    }

    for (let i = 0; i < word.length; i++) {
      if (newWord.includes(word[i])){
        newWord = newWord.replace(word[i], '');
      }
      else {
        return false
      };
    };

    for(let i=0;i<carpet.length;i++) {
      let letter = String.fromCharCode(carpet[i] + 65);
      if (newWord.includes(letter)) {newWord = newWord.replace(letter,'')}
    };

    if (newWord !== '') {return false};
    return true
  }

  function validstr(word,joueur){
    // Verifie si le mot à la bonne longueur
    if (word.length>9){
      console.log("le mot ne doit pas dépasser 9 caractères.");
      file.register("Joueur " + joueur+1 + " : le mot ne doit pas dépasser 9 caractères")
      return false}
    else if (word.length < 3){
      console.log("Le mot doit être supérieur à trois caractères.");
      file.register("Joueur " + joueur+1 + " : le mot doit être supérieur à trois caractères")
      return false}
    return true;
  };

  function verifmotinDico(mot){
    // Fonction de vérification du mot dans le dictionnaire
    if (contenuFichier.includes(mot)) {
      console.log("Le mot est bien présent dans le dictionnaire");
      file.register("Le mot est bien présent dans le dictionnaire")
      return true;
    }
    console.log("Le mot n'est pas présent dans le dictionnaire");
    file.register("Le mot n'est pas présent dans le dictionnaire")

    avis = file.input("Acceptez-vous tout de meme ce mot ?(oui/non) ",["oui","non","o","n"]);
    if (avis==="oui" || avis==="o"){
      file.register("Le mot est tout de même accepté par le joueur")
      return true;
    };
    return false
  };

  
  this.verifMot= function(word,newWord,carpet,joueur){
    // Verifie que le mot est jouable
    verified = anagram(word,newWord,carpet) && validstr(newWord,joueur) && verifmotinDico(newWord);
    return verified
  };

  this.checkValid = function(valid){
    let check=[];
    for(let i=0;i<valid;i++){check.push(String(i+1));};
    return check
  };

  this.validLetters = function(letters, carpet){
    strCarpet = "";
    for (let i = 0; i < carpet.length; i++) {
      strCarpet += String.fromCharCode(carpet[i]+65);
    }
    letters = letters.split(" ");
    if (letters.length != 3) {
      return false
    }
    for (let j = 0; j < letters.length; j++) {
      letter = letters[j].toUpperCase();
      if (!strCarpet.includes(letter)) {
        return false
      }
      else{
        strCarpet = strCarpet.replace(letter, '');
      }
    }
    return true
  };
}

module.exports = new verifs;
