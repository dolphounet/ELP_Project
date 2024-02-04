const readline = require('readline-sync');
var verifs = require('./verifs');
var file = require('./file');
var visuels = require('./visuels')

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

function replaceCarpet(letters, carpet, sac) {
  letters = letters.replaceAll(" ", "").toUpperCase();
  for (let i = 0; i < carpet.length; i++) {
    if (letters.includes(String.fromCharCode(carpet[i]+65))){
      letters.replace(String.fromCharCode(carpet[i]+65), "");
      carpet[i] = draw(sac, 1)[0];
    }
  }
}

function removeSpaces(carpets) {
  return carpets.map(carpet => carpet.filter(letter => letter !== 32-65))
}



function jarnacFunction(position,word,newWord,joueur,adversaire,carpet,grilles,sac){

  newWord = newWord.toUpperCase();
  grilles[adversaire][position] = "";
  for (let i = position; i < grilles[adversaire].length-1; i++) {
    if (grilles[adversaire][i+1] != ""){grilles[adversaire][i]=grilles[adversaire][i+1]}
  }

  let fait = false
  for (let i=0;i<grilles[joueur].length;i++){
    if (grilles[joueur][i]==="" && fait==false) {
      grilles[joueur][i]=newWord
      fait = true
    }
  }

  for (let i = 0; i < word.length; i++) {
    if (newWord.includes(word[i])){
      newWord = newWord.replace(word[i],'');
    }
  }

  for(let i=0;i<6;i++) {
    const letter = String.fromCharCode(carpet[i] + 65).toUpperCase();
    if (newWord.includes(letter)){
      newWord = newWord.replace(letter,'');
      carpet[i] = 32-65;
    }
  }
}

function placing(position,word,newWord,carpet,grille,sac){
  
  newWord = newWord.toUpperCase();
  grille[position] = newWord;
  for (let i = 0; i < word.length; i++) {
    if (newWord.includes(word[i])){
      newWord = newWord.replace(word[i],'');
    }
  }

  for(let i=0;i<carpet.length;i++) {
    const letter = String.fromCharCode(carpet[i] + 65).toUpperCase();
    if (newWord.includes(letter)){
      newWord = newWord.replace(letter,'');
      carpet[i] = 32-65;
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
    console.log("La partie est terminée !");
    console.log("points du joueur 1 : ",pointsCounter(grilleA));
    console.log("points du joueur 2 : ",pointsCounter(grilleB));
    file.register("Fin du jeu");
  }
  else{
    console.log("le jeu continue")
  };
  return game_over
}

// ######## THE GAME ##############

function game(){
  // Creation des objets de jeu
  let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];
  let tour = 0;
  let carpets = [draw(sac,6),draw(sac,6)];
  let grilles = [
    ["","","","","","","",""],["","","","","","","",""]
  ];

  // Variables de tour
  let joueur = 0;
  let adversaire = 1;
  let valid = [];
  let playing = true;
  let jarnac = 0;
  let replace = 1;
  let drawNextTurn = [false, false];

  // Affichage de début de jeu
  console.log("Début du jeu !\n")
  file.register("Debut du jeu !")

  // Boucle de jeu
  while (playing){
    
    // Variable du joueur
    joueur = tour%2;
    if (drawNextTurn[joueur]) {
      carpets[joueur].push(draw(sac, 1)[0]);
      drawNextTurn[joueur] = false;
    }

    carpets = removeSpaces(carpets);
    valid = visuels.Affichage(grilles,carpets,joueur,jarnac)
    jarnacCond = jarnac !== 0 && tour !== 0 && valid[(tour+1)%2]>1;
    replaceCond = replace === 1 && carpets[joueur].length >= 3;

    if(jarnacCond && replaceCond){
      action = file.input("Action à jouer ce tour (jouer/jarnac/remplacer/passer/quitter) ? ",["jouer","j","passer","p","jarnac","quitter","q", 'remplacer', 'r']);
    }
    else if(!jarnacCond && replaceCond){
      action = file.input("Action à jouer ce tour (jouer/remplacer/passer/quitter) ? ",["jouer","j","passer","p","quitter","q", 'remplacer', 'r']);
    }
    else if(jarnacCond && !replaceCond){
      action = file.input("Action à jouer ce tour (jouer/jarnac/passer/quitter) ? ",["jouer","j","passer","p","jarnac","quitter","q"]);
    }
    else{
      action = file.input("Action à jouer ce tour (jouer/passer/quitter) ? ",["jouer","j","passer","p","quitter","q"]);
    }

    file.register("Joueur " + (joueur+1) + " : " + action)

    if (action === "jouer" || action === "j"){
      adversaire = tour%2;
      jarnac = 0;
    }
    else if (action === "jarnac"){
      adversaire = (tour+1)%2;
    }
    else if (action === "passer" || action === "p"){jarnac = 2;
      replace = 1;
      tour ++;
      drawNextTurn[joueur] = true;
      continue;
    }
    else if (action === "quitter" || action === "q"){
      playing=false;console.log("Fermeture du jeu...");
      continue;
    }
    else if (action === "remplacer" || action === "r"){
      replace = 0;
      jarnac = 0;
      letters = readline.question("Quelles lettres remplacer (lettres du tapis séparées par un espace) ? ");
      while (!verifs.validLetters(letters, carpets[joueur])){
        letters = readline.question("Les lettres ne sont pas dans le tapis ou il n'y en a pas 3. (lettres du tapis séparées par un espace) ");
      }
      replaceCarpet(letters, carpets[joueur], sac);
      file.register("Joueur " + (joueur+1) + " a remplacé les lettres " + letters.toUpperCase() + " de son tapis");
      continue;
    }
    else {console.log("L'action n'existe pas.");continue;}
    
    let position = 1

    if(action != "jarnac"){
      if (valid[adversaire]!=1){
        position = file.input('Ou jouer (chiffre de 1 a ' + String(valid[adversaire]) + ') ? ',verifs.checkValid(valid[adversaire]));
      }
    }
    else{
      if (valid[adversaire]-1!=1){
        position = file.input('Ou jouer (chiffre de 1 a ' + String(valid[adversaire]-1) + ') ? ',verifs.checkValid(valid[adversaire]-1));
      }
    }
    file.register("Joueur " + (joueur+1) + " : position : " + position)
    newWord = readline.question("Quel mot jouer ? ");
    file.register("Joueur " + (joueur+1) + " : mot : " + newWord)

    if (!verifs.verifMot(grilles[adversaire][position-1],newWord, carpets[adversaire],joueur)){ 
      console.log("Le mot n'est pas valide !");
      file.register("Joueur " + (joueur+1) + " : action non valide")
    }else if (action != "jarnac"){
      file.register("Joueur " + (joueur+1) + " : action valide")
      placing(position-1,grilles[adversaire][position-1],newWord,carpets[adversaire],grilles[joueur],sac);
      carpets[adversaire].push(draw(sac, 1)[0]);
    }
    else{
      jarnacFunction(position-1,grilles[adversaire][position-1],newWord,joueur,adversaire,carpets[adversaire],grilles,sac);
      file.register("Joueur " + (joueur+1) + " : jarnac valide")
      jarnac --;
    }
  
    if (gameEnd(grilles[0],grilles[1])){
      playing = false;
    }
  }
}

game();


