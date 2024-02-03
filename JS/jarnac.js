const readline = require('readline-sync');
var verifs = require('./verifs');
var file = require('./file');


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

function jarnacFunction(position,word,newWord,joueur,adversaire,carpet,grilles,sac){
  // Init
  newWord = newWord.toUpperCase();
  console.log("ici hein")
  // Virer de la grille de l'adversaire et décaler les trucs
  grilles[adversaire][position] = "";
  for (let i = position; i < grilles[adversaire].length-1; i++) {
    if (grilles[adversaire][i+1] != ""){grilles[adversaire][i]=grilles[adversaire][i+1]}
  }

  console.log("trucmuche")
  // Placer chez le joueur
  let fait = false
  for (let i=0;i<grilles[joueur].length;i++){
    if (grilles[joueur][i]==="" && fait==false) {
      grilles[joueur][i]=newWord
      fait = true
    }
  }

  // Remains
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
  console.log("fin jarnacfunction")
}

function placing(position,word,newWord,carpet,grille,sac){
  
  // Remplacer
  newWord = newWord.toUpperCase();
  grille[position] = newWord;
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
  console.log(grilleA)
  console.log(grilleB)
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

function normaliseStr(string,length,separ){
  add = length-string.length
  for (let i=0;i<add;i++){
    string += " "
  }
  return string + separ
}


function newAffichage(grilles,carpets,player,jarnac){

  // Init
  let maxlenght = 28;
  let begin = "   ║    "
  let ext = "║   "
  let separ = "     ║     ";
  let valid = [1,1];
  let strCarpet = ["",""];
  let strGrille = "";

  for (let i=0;i<2;i++){for (let j=0;j<6;j++){strCarpet[i] += "  " + String.fromCharCode(carpets[i][j] + 65);}}
  for (let j=0;j<8;j++){
    if (grilles[0][j]!=""){valid[0] ++;}
    if (grilles[1][j]!=""){valid[1] ++;}
    if (j!= 7){strGrille +=  normaliseStr(begin + "   " + String(j+1) + ". : " + grilles[0][j],maxlenght,separ) + normaliseStr("   " + String(j+1) + ". : " + grilles[1][j],maxlenght-2,ext) + "\n"}
    else {strGrille +=  normaliseStr(begin + "   " + String(j+1) + ". : " + grilles[0][j],maxlenght,separ) + normaliseStr("   " + String(j+1) + ". : " + grilles[1][j],maxlenght-2,ext)}
  }
  console.log("   ╔═════════════════════════════════════════════════════════════╗")
  console.log("   ║                      Tour du joueur "+String(player+1)+"                       ║")
  console.log("   ╠═════════════════════════════╦═══════════════════════════════╣")
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log(normaliseStr(begin + "Grille du joueur : 1",maxlenght,separ)+normaliseStr("Grille du joueur : 2",maxlenght-2,ext))
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log(strGrille)
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log("   ╠═════════════════════════════╬═══════════════════════════════╣")
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log(normaliseStr(begin + " Tapis du Joueur : 1",maxlenght,separ)+normaliseStr(" Tapis du Joueur : 2",maxlenght-2,ext))
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log(normaliseStr(begin + strCarpet[0],maxlenght,separ)+normaliseStr(strCarpet[1],maxlenght-2,ext));
  console.log(normaliseStr(begin + "",maxlenght,separ)+normaliseStr("",maxlenght-2,ext))
  console.log("   ╠═════════════════════════════╩═══════════════════════════════╣")
  console.log("   ║                   Jarnac Possibles : " +String(jarnac) +"                      ║")
  console.log("   ╚═════════════════════════════════════════════════════════════╝\n")

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
  let valid = [];
  let playing = true;
  let jarnac = 0

  // Affichage de début de jeu
  console.log("Let's begin\n")

  // Boucle de jeu
  while (playing){
    
    // Variable du joueur
    joueur = tour%2;
    valid = newAffichage(grilles,carpets,joueur,jarnac)

    // Input demander l'action du tour Jarnac / jouer / arrêter
    if(jarnac <= 2 && tour != 0 && valid[(tour+1)%2]>1){action = file.input("Action a jouer ce tour (jouer/jarnac/passer/quitter) ? ",["jouer","j","passer","p","jarnac","quitter"]);}
    else{action = file.input("Action a jouer ce tour (jouer/passer/quitter) ? ",["jouer","j","passer","p","quitter"]);}
    file.log("log", "Joueur " + (joueur+1) + " : " + action)
      .then(() => resolve())
      .catch((error) => console.log("Erreur lors de l'écriture de log : " + error))
    // Préparer le jeu en fonction de l'action
    if (action === "jouer" || action === "j"){adversaire = tour%2; jarnac=2;}
    else if (action === "jarnac"){adversaire = (tour+1)%2; jarnac++;}
    else if (action === "passer" || action === "p"){jarnac = 0;tour ++;continue;}
    else if (action === "quitter"){playing=false;console.log("Fermeture du jeu...");continue;}
    else {console.log("L'action n'existe pas.");continue;}
    
    // Placer un mot
    let position = 1

    if(action != "jarnac"){
      if (valid[adversaire]!=1){position = file.input('Ou jouer (chiffre de 1 a ' + valid[adversaire] + ') ? ',verifs.checkValid(valid[adversaire]));}
    }
    else{
      if (valid[adversaire]-1!=1){position = file.input('Ou jouer (chiffre de 1 a ' + valid[adversaire] + ') ? ',verifs.checkValid(valid[adversaire]));}
    }
    
    file.log("log", "Joueur " + (joueur+1) + " : position : " + position)
      .then(() => resolve())
      .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
    newWord = readline.question("Quel mot jouer ? ");
    file.log("log", "Joueur " + (joueur+1) + " : mot : " + newWord)
      .then(() => resolve())
      .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
  
    // Verifier que l'input est valide (Longueur + rapport au mot + carpet)
    if (!verifs.verifMot(grilles[adversaire][position-1],newWord, carpets[adversaire])){ 
      console.log("Le mot n'est pas valide !");
      file.log("log", "Joueur " + (joueur+1) + " : action non valide")
      .then(() => resolve())
      .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
    }else if (action != "jarnac"){
      file.log("log", "Joueur " + (joueur+1) + " : action valide")
      .then(() => resolve())
      .catch((error) => console.log("Erreur lors de l'écriture de log" + error))
      placing(position-1,grilles[adversaire][position-1],newWord,carpets[adversaire],grilles[joueur],sac); // Placer le nouveau mot, déduire du tapis les lettres utilisées
    }
    else{
      
      jarnacFunction(position-1,grilles[adversaire][position-1],newWord,joueur,adversaire,carpets[adversaire],grilles,sac); // Placer le nouveau mot, déduire du tapis les lettres utilisées
    }
  
    if (gameEnd(grilles[0],grilles[1])){
      playing = false;
    }
  }
}

game();


