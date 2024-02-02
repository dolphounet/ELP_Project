const { writeFile, appendFile } = require('node:fs/promises');
const fs = require('fs');
const readline = require('readline-sync');



// ############## FICHIERS ##################

function fileInit(file) {
  try {
    writeFile(file, "");
    console.log("c'est bongue");
  } catch (error) {
    console.log("Erreur lors de l'initialisation du fichier :", error.message);
  };
}

function log(file, data) {
  try {
    appendFile(file, data+"\n\r");
  } catch (error) {
    console.log("Erreur lors de l'écriture de log :", error.message);
  }
}

// ################ VERIF ####################

function validstr(word){
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
    }
  }

  // Test si les lettres restantes sont sur le tapis
  for(let i=0;i<6;i++) {
    let letter = String.fromCharCode(carpet[i] + 65);
    if (newWord.includes(letter)) {newWord = newWord.replace(letter,'')}
  }
  
  if (newWord !== '') {return false}
  return true
}

function verifMot(newWord,word,carpet){
  return anagram(newWord,word,carpet) && validstr(newWord) && verifmotinDico(newWord)
}

// Fonction de vérification du mot dans le dictionnaire
function verifmotinDico(mot) {
  if (contenuFichier.includes(mot)) {
      console.log("Le mot est bien présent dans le dictionnaire");
      return true;
  } 
  else {
      console.log("Le mot n'est pas présent dans le dictionnaire");
      avis = readline.question("Acceptez-vous tout de meme ce mot ?(oui/non)").toLowerCase();
      while (!["oui","non"].includes(avis)){
        avis = readline.question("Acceptez-vous tout de meme ce mot ?(oui/non)").toLowerCase();
      }
      if (avis==="oui"){
        return true

      }
      else if (avis=="non"){
        return false 
      }

      return false;
  };
}

function verifMot(word,newWord,carpet){
  verified = anagram(word,newWord,carpet) && validstr(newWord) && verifmotinDico(newWord);
  return verified
}

// ########## GAME FUNCTIONS #################

function draw(sac, n) {
  let letters = [];
  for (let i = 0; i < n; i++) {
    const element = n[i];
    let nb_aleat = Math.floor(Math.random()*26);
    while (sac[nb_aleat] == 0) { 
      let nb_aleat = Math.floor(Math.random()*26);
    };
    letters.push(nb_aleat);
    sac[nb_aleat] -= 1;
  };
  return letters
}

function placing(postion,word,newWord,carpet,grille,sac){
  
  // Remplacer
  newWord = newWord.toUpperCase();
  grille[postion] = newWord;
  for (let i = 0; i < word.length; i++) {
    if (newWord.includes(word[i])){
      newWord = newWord.replace(word[i],'');
    }
  }
  // Piocher de nouveau
  console.log(carpet, newWord)
  for(let i=0;i<6;i++) {
    const letter = String.fromCharCode(carpet[i] + 65).toUpperCase();
    if (newWord.includes(letter)){
      console.log(letter)
      newWord = newWord.replace(letter,'');
      carpet[i] = draw(sac,1)[0];
    }
  }
  console.log(carpet)
}

function pointsCounter(grille){
  let points = 0;
  for(let i=0;i<8;i++) {
    points = points + (grille[i].length)**2;
  };
  return points
}

function gameEnd(grilleA, grilleB){
  let game_over = false
  if (grilleA[7]!="" || grilleB[7]!=""){
    game_over = true;
    console.log("points de l'équipe A:",pointsCounter(grilleA))
    console.log("points de l'équipe B:",pointsCounter(grilleB))
  }
  else{
    console.log("le jeu continue")
  };
  return game_over
}

// ########### VISUELS ###########

function affichage(grille,carpet,player){
  let valid = 0;

  // Affichage du tapis
  console.log("Tapis du Joueur : "+String(player+1))
  let strCarpet = "";
  for (let i=0;i<carpet.length;i++){
    strCarpet += " " + String.fromCharCode(carpet[i] + 65);
  }
  console.log(strCarpet + "\n");
  // Affichage de la grille
  console.log("Grille du joueur : "+String(player+1));
  for (let i=0;i<8;i++){
    if (grille[i]!=""){
      valid ++;
      console.log(String(i+1)+". : "+grille[i]);
    }
  }
  console.log(String(valid+1)+". : \n");
  return valid
}

// ######## THE GAME ##############

function game(){
  // Creation des objets de jeu
  let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];
  let tour = 0;
  let carpets = [draw(sac, 6),draw(sac,6)];
  let grilles = [
    ["","","","","","","",""],["","","","","","","",""]
  ];

  // Variables de tour
  let joueur = 0;// Au début du tour
  let adversaire = 1;
  let valid = 0;
  let playing = true;
  let jarnac = 0
  // Affichage de début de jeu
  console.log("Let's begin\n")

  // Boucle de jeu
  while (playing){
    // Input demander l'action du tour Jarnac (simple ou double) / jouer / arrêter
    joueur = tour%2;
    console.log("Joueur " + (joueur+1));
    if(jarnac <= 2 && tour != 0){
      action = readline.question("Action à jouer ce tour (jouer/jarnac/arreter) ? ").toLowerCase();
      while (!["jouer","j","arreter","jarnac"].includes(action)){
        action = readline.question("Action à jouer ce tour (jouer/jarnac/arreter) ? ").toLowerCase();
      }
    }else{
      action = readline.question("Action à jouer ce tour (jouer/arreter) ? ").toLowerCase();
      while (!["jouer","j","arreter"].includes(action)){
        action = readline.question("Action à jouer ce tour (jouer/arreter) ? ").toLowerCase();
      }
    }
    
    if (action === "jouer" || action === "j"){adversaire = tour%2; jarnac=2}
    else if (action === "jarnac"){adversaire = (tour+1)%2; jarnac++}
    else if (action === "arreter"){
      jarnac ++;
      tour ++;
      continue;
    }
    else {
      console.log("L'action n'existe pas.");
      continue;
    }

    // Affichage
    valid = affichage(grilles[adversaire],carpets[adversaire],adversaire)+1 // Afficher la grille et le tapis,
    // Input : Proposer les endroits ou il peut jouer et demander ou il joue
    position = readline.question('Où jouer (chiffre de 1 à ' + valid + ') ? ');
    // Bonus : Decouper les lettres dispos (affichage mais on verra plus tard)
    newWord = readline.question("Quel mot jouer ? ");
    verified = verifMot(newWord, grilles[adversaire][position-1], carpets[adversaire])// Verifier que l'input est valide (Longueur + rapport au mot + carpet)
    

    // Verifier que l'input est valide (Longueur + rapport au mot + carpet)
    if (!verifMot(grilles[adversaire][position-1],newWord, carpets[adversaire])){ 
      console.log("Le mot n'est pas valide !");
    }else if (action != jarnac){
      placing(position-1,grilles[adversaire][position-1],newWord,carpets[adversaire],grilles[joueur],sac); // Placer le nouveau mot, déduire du tapis les lettres utilisées
    }
  
    if (gameEnd(grilles[0],grilles[1])){
      playing = false;
    }
  }
}

// Déclaration de la variable globale pour stocker dico
var contenuFichier;

// Lecture du dico et stockage de son contenu en var globale
try {
  contenuFichier = fs.readFileSync('liste_francais.txt', 'utf8');
  console.log("Contenu du dictionnaire bien stocké dans la variable globale");
  
} catch (err) {
  console.error("Erreur de lecture du fichier :", err);
};


game();

fileInit('log');

/*
let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];
let carpet = draw(sac, 5)
console.log("carpet")
console.log(carpet)
console.log(sac)
console.log(carpet.map((letter) => String.fromCharCode(letter + 65)))
console.log([19,18,20,17,21].map((letter) => String.fromCharCode(letter + 65)))
console.log(anagram("ruat","rat",[19,18,20,17,21].map((letter) => String.fromCharCode(letter + 65))))
*/

/*
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  log('log', answer)
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
*/
