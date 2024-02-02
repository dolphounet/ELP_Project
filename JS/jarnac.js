const { writeFile, appendFile } = require('node:fs/promises');
const fs = require('fs');
const readline = require('readline-sync');
var verifsModule = require('./verifs');
var verifs = new verifsModule()

// ############## FICHIERS ##################

async function fileInit(file) {
  try {
    await writeFile(file, "");
    console.log("c'est bongue");
  } catch (error) {
    console.log("Erreur lors de l'initialisation du fichier :", error.message);
  }
}

async function log(file, data) {
  try {
    await appendFile(file, data + "\n\r");
  } catch (error) {
    console.log("Erreur lors de l'écriture de log :", error.message);
  }
}


// #### Verifs ####

// Fonction de vérification du mot dans le dictionnaire
function verifmotinDico(mot) {
  let verified = false;
  if (contenuFichier.includes(mot)) {
      console.log("Le mot est bien présent dans le dictionnaire");
      verified = true;
  } 
  else {
    console.log("Le mot n'est pas présent dans le dictionnaire");
    avis = input("Acceptez-vous tout de meme ce mot ?(oui/non)",["oui","non"]);
    if (avis==="oui"){
      verified = true;
    };
  };
  return verified
}

function verifMot(word,newWord,carpet){
  verified = verifs.anagram(word,newWord,carpet) && verifs.validstr(newWord) && verifmotinDico(newWord);
  return verified
}

// ########## GAME FUNCTIONS #################

function draw(sac, n) {
  let letters = [];
  for (let i = 0; i < n; i++) {
    const element = n[i];
    let nb_aleat = Math.floor(Math.random()*26);
    while (sac[nb_aleat] == 0) { 
      nb_aleat = Math.floor(Math.random()*26);
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
  for(let i=0;i<6;i++) {
    const letter = String.fromCharCode(carpet[i] + 65).toUpperCase();
    if (newWord.includes(letter)){
      newWord = newWord.replace(letter,'');
      carpet[i] = draw(sac,1)[0];
    }
  }
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

function input(question,check){
  answ = readline.question(question).toLowerCase();
  while (!check.includes(answ)){
    answ = readline.question(question).toLowerCase();
  }
  return answ
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
    
    // Variable du joueur
    joueur = tour%2;
    console.log("Joueur " + (joueur+1));

    // Input demander l'action du tour Jarnac / jouer / arrêter
    if(jarnac <= 2 && tour != 0){action = input("Action a jouer ce tour (jouer/jarnac/arreter/quitter) ? ",["jouer","j","arreter","jarnac","quitter"]);}
    else{action = input("Action a jouer ce tour (jouer/arreter/quitter) ? ",["jouer","j","arreter","quitter"]);}
    
    // Préparer le jeu en fonction de l'action
    if (action === "jouer" || action === "j"){adversaire = tour%2; jarnac=2;}
    else if (action === "jarnac"){adversaire = (tour+1)%2; jarnac++;}
    else if (action === "arreter"){jarnac = 0;tour ++;continue;}
    else if (action === "quitter"){playing=false;console.log("Fermeture du jeu...");continue;}
    else {console.log("L'action n'existe pas.");continue;}

    // Affichage
    valid = affichage(grilles[adversaire],carpets[adversaire],adversaire)+1 // Afficher la grille et le tapis,
    
    // Placer un mot
    let position = 1
    if(valid!=1){checkValid = function(valid){let check=[];for(let i=0;i<valid;i++){check.push(String(i+1));};return check};position = input('Ou jouer (chiffre de 1 a ' + valid + ') ? ',checkValid(valid));}
    newWord = readline.question("Quel mot jouer ? ");
  
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
