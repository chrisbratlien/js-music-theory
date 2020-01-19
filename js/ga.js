// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S17-2-Intelligence-Learning

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&


// This file includes functions for creating a new generation
// of birds.

// Start the game over

var bestBird, bestBirdEver;
var abort;

const times = function(n) { 
  return function(f) {
    let iter = function(i) {
      if (i === n) return;
      f (i);
      iter (i + 1);
    };
    return iter (0);
  };
};

function resetGame() {
  counter = 0;
  // Resetting best bird score to 0
  if (bestBird) {
    //bestBird.score = 0;
  }
}

function longestRunLength(a) {
  var longest = 0;
  var run = 0;
  a.forEach(function(v,i) {
    if (i > 0 && a[i] == a[i-1]) {
      run++;
      if (run > longest) { longest = run; }
    } else {
      run = 0;
    }
  });
  return longest;
}

function histogram(a) {
  var hash = {};
  a.forEach(function(o){
    hash[o] ? hash[o]++ : hash[o] = 1;
  });
  return hash;
}


function allBirdsScores() {
  var scores = allBirds.map(o => o.getScore());
  return scores;
}
function activeBirdsScores() {
  var scores = activeBirds.map(o => o.getScore());
  return scores;
}

function getBestBird() {
  var result = activeBirds.slice().sort(BSD.sorter(function(o){
    return o.getScore();
  })).pop();
  bestBird = result;
  return result;
}
function showBirds() {
  activeBirds.forEach(o => console.table([o.history.predict]));
}

// Create the next generation
function nextGeneration() {
  ///resetGame();
  // Normalize the fitness values 0-1
  bestBird = getBestBird();
  if (!bestBirdEver) { bestBirdEver = bestBird; }
  if (bestBird && bestBirdEver && bestBird.getScore() > bestBirdEver.getScore()) {
    bestBirdEver = bestBird;
    console.log('new bestBirdEver with score',bestBirdEver.getScore(),bestBirdEver);
  }


  
  activeBirds = activeBirds.select(function(bird){
    return bird.getScore() >= 0;
  });
  


  /***
  activeBirds = activeBirds.select(function(bird){
    var d = bird.noteDiversity();
    if (bird.history.predict.length == 0) { return true; }
    return d > 4;
  });
  **/

  normalizeFitness(activeBirds);
  // Generate a new set of birds
  activeBirds = generate(activeBirds);


  while(activeBirds.length < TOTAL_BIRDS) {
    //activeBirds.push(new Bird(null,BSD.audioPlayer.spec.range));
    //activeBirds.push(activeBirds.atRandom().copy());
    if (activeBirds.length == 0) {
      console.log('all gone, rebuilding');
      activeBirds.push(new Bird(null,limitedRange,0.12));
    }
    else {
      ///activeBirds.push(activeBirds.atRandom().copy());
      activeBirds.push(bestBird.copy());
      //activeBirds.push((bestBirdEver || bestBird || getBestBird()).copy());
    }
  }
  // Copy those birds to another array
  allBirds = activeBirds.slice();
}

// Generate a new population of birds
function generate(oldBirds) {
  let newBirds = [];
  for (let i = 0; i < oldBirds.length; i++) {
    // Select a bird based on fitness
    let bird = poolSelection(oldBirds);
    newBirds[i] = bird;
  }
  return newBirds;
}

// Normalize the fitness of all birds
function normalizeFitness(birds) {
  // Make score exponentially better?

  /**
  birds.forEach(function(bird){
    bird.score = Math.pow(bird.score,2);
  })
  **/

  var scores = birds.map(function(bird){
    return bird.getScore();
  });

  // Add up all the scores
  var sum = scores.sum();


  // Divide by the sum
  birds.forEach(function(bird){
    bird.fitness = bird.getScore() / sum;
  })
}


// An algorithm for picking one bird from an array
// based on fitness
function poolSelection(birds) {
  // Start at 0
  let index = 0;

  // Pick a random number between 0 and 1
  let r = Math.random();

  // Keep subtracting probabilities until you get less than zero
  // Higher probabilities will be more likely to be fixed since they will
  // subtract a larger number towards zero
  while (r > 0) {
    r -= birds[index].fitness;
    // And move on to the next
    index += 1;
  }

  // Go back one
  index -= 1;

  // Make sure it's a copy!
  // (this includes mutation)
  return birds[index].copy();
}