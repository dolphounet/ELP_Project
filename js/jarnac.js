let sac = [14, 4, 7, 5, 19, 2, 4, 2, 11, 1, 1, 6, 5, 9, 8, 4, 1, 10, 7, 9, 8, 2, 1, 1, 1, 2];

function draw(sac, n) {
  let letters = [];
  for (let i = 0; i < n; i++) {
    const element = n[i];
    let nb_aleat = Math.floor(Math.random()*27);
    if (sac[nb_aleat] !== 0) {
      letters.push(nb_aleat);
      sac[nb_aleat] -= 1;
    }
  }
  return letters
}
