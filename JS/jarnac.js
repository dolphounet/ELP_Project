const { writeFile, appendFile } = require('node:fs/promises');

function draw(sac, n) {
  let letters = [];
  for (let i = 0; i < n; i++) {
    const element = n[i];
    let nb_aleat = Math.floor(Math.random()*26);
    while (sac[nb_aleat] == 0) { 
      let nb_aleat = Math.floor(Math.random()*26);
    }
    letters.push(nb_aleat);
    sac[nb_aleat] -= 1;
  }
  return letters
}

function fileInit(file) {
  try {
    writeFile(file, "");
    console.log("c'est bongue");
  } catch (error) {
    console.log("erreur", error.message);
  };
}

function log(file, data) {
  try {
    appendFile(file, data+"\n\r");
  } catch (error) {
    console.log("error", error.message)
  }
}

function anagram(newWord,word,carpet) {
  // Initialisation
  const res = true
  newWord = newWord.toUpperCase()
  word = word.toUpperCase()

  // Test de la présence du mots dans la nouvelle propal
  for (let i = 0; i < word.length; i++) {
    if (!newWord.includes(word[i])){
      res = false
    };
  }
  // Test si les lettres restantes sont sur le tapis
  remains = newWord.replace(word,'')
  for(let i=0;i<6;i++) {
    const letter = carpet[i];
    if (remains.includes(letter)) {remains = remains.replace(letter,'')}
  }
  if (remains === '') {res = true}
  
  return res
}

function validstr(word){
  let valid = false;
  if (word.length>9){
    console.log("le mot ne doit pas dépasser 9 caractères")
  }
  else{
    valid = true;
  }
  return valid
}

function pointsCounter(grille){
  let points = 0;
  for(let i=0;i<8;i++) {
    points = points + (grille[i].length)**2
  }
  return points
}


function game(){
  // Creation des objets de jeu
  let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];
  let tour = 0;
  let carpets = [draw(sac, 6),draw(sac,6)];
  let grilles = [
    ["RAT","","","","","","",""],["NO","","","","","","",""]
  ];

  // Variables de tour
  let joueur = 0;// Au début du tour
  let adversaire = 1;
  let valid = 0;

  // Affichage de début de jeu
  console.log("Let's begin\n")

  affichage(grilles[joueur],carpets[joueur],joueur)

  /*
  // Boucle de jeu
  while (true){
    if (tour%2==0){
      // Input demander l'action du tour Jarnac (simple ou double) / jouer / arrêter
      action = "Jouer".toLowerCase()
      if (action == "jouer"){adversaire = 0}
      else if (action == "jarnac"){adversaire = 1}
      else {
        tour ++

      }
      
      valid = affichage(grilles[joueur],carpets[joueur],joueur) // Afficher la grille et le tapis

      // Input : Proposer les endroits ou il peut jouer et demander ou il joue
      // Bonus : Decouper les lettres dispos (affichage mais on verra plus tard)
      verified = verifMot()// Verifier que l'input est valide (Longueur + rapport au mot + carpet)
      // Placer le nouveau mot, déduire du tapis les lettres utilisées


    }
  }*/
}

function verifMot(newWord,word,carpet){
  verified = anagram(newWord,word,carpet)
}

function affichage(grille,carpet,player){
  let valid = 0;

  // Affichage du tapis
  console.log("Tapis du Joueur : "+String(player+1))
  let strCarpet = ""
  for (let i=0;i<carpet.length;i++){
    strCarpet += " " + String.fromCharCode(carpet[i] + 65);
  }
  console.log(strCarpet + "\n")
  // Affichage de la grille
  console.log("Grille du joueur : "+String(player+1))
  for (let i=0;i<8;i++){
    if (grille[i]!=""){
      valid ++;
      console.log(String(i+1)+". : "+grille[i])
    }
  }
  console.log(String(valid+1)+". : \n")
  return valid
}


function gameEnd(grilleA, grilleB){
  if (grilleA[7]!="" || grilleB[7]!=""){
    let game_over = true;
    console.log("points de l'équipe A:",pointsCounter(grilleA))
    console.log("points de l'équipe B:",pointsCounter(grilleB))
  
  }
  else{
    console.log("le jeu continue")
  }
}

game()

fileInit('log')

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