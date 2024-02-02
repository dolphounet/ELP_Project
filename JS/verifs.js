function verifs(){
// ################ VERIF ####################

    this.validstr = function (word){
        if (word.length>9){
        console.log("le mot ne doit pas dépasser 9 caractères.");
        return false
        }
        else if (word.length < 3){
        console.log("Le mot doit être supérieur à trois caractères.");
        return false
        }
        return true;
    }
  
    this.anagram = function(word,newWord,carpet) {
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
}

module.exports = verifs;