# Jarnac - LEVEQUE, POISSE-JOUBERT, VATAN

## Installation

- npm install package.json ou npm install readline-sync


## JEU

Ce jeu se base sur le jeu JARNAC et suis les règles décrites ici : https://github.com/sfrenot/javascript/blob/2dc88c42dc77c3494afea61f1a895064e91d91ef/projet2/RegleJarnac.pdf

### Comment jouer (en connaissant les règles du jeu originel)

Au début de votre tour, si vous ne commencez pas la partie, vous pouvez décider de placer un mot, passer votre tour, lancer un jarnac immédiatement après le tour de l'adversaire, quitter le jeu ou bien quitter pour arrêter la partie.

#### Jouer

<br>NB : Cette action vous empêchera de faire un ou plusieurs jarnac durant votre tour<br>

Lorsque vous faites jouer, si vous avez au moins une ligne remplie, il vous sera demandé de choisir sur quelle ligne vous voulez jouer (Si vous n'avez aucun mot sur votre grille, le jeu vous placera automatiquement sur la 1ère colonne).<br>
Il sera alors demandé de donner le mot et s'il est valide selon les critères du jeu et dans le dictionnaire fournis, il sera placé (Dans l'éventualité ou le mot est valide selon le jeu mais non présent dans le dictionnaire, les joueurs peuvent choisir s'ils souhaitent accepter le mot ou non)<br>
Après cette action vous piochez une lettre, il est possible de jouer jusqu'à passer son tour

#### Passer

Vous passez votre tour, c'est à votre adversaire de jouer.

#### Quitter

Vous terminez la partie en l'état sans calcul de points, utile pour quitter le jeu sans interrompre le processus brutalement.

#### Jarnac

Lorsque vous jouez après un adversaire vous pouvez lancer un jarnac, il vous sera alors demandé (sauf si votre adversaire n'a qu'un mot), de choisir sur quel mot adverse vous voulez jouer et avec quel mot, une fois un jarnac validé vous perdez 1 "jeton de jarnac". Vous avez 2 jetons par tour pour permettre deux jarnacs consécutifs dans le même tour.