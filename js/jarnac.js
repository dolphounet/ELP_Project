const { writeFile, appendFile } = require('node:fs/promises');

let grilleA = ["","","","","","","","test"];
let grilleB = ["","","","","","","chose",""];

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

let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];
let carpet = draw(sac, 5)
console.log("carpet")
console.log(carpet)
console.log(sac)
console.log(carpet.map((letter) => String.fromCharCode(letter + 65)))
console.log([19,18,20,17,21].map((letter) => String.fromCharCode(letter + 65)))
console.log(anagram("ruat","rat",[19,18,20,17,21].map((letter) => String.fromCharCode(letter + 65))))
gameEnd(grilleA,grilleB)


fileInit('log')

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('What do you think of Node.js? ', (answer) => {
  log('log', answer)
  console.log(`Thank you for your valuable feedback: ${answer}`);

  rl.close();
});
