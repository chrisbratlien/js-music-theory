

 
function mutate(x) {
  if (p5.prototype.random(1) < 0.1) {
    let offset = p5.prototype.randomGaussian() * 0.5;
    let newx = x + offset;
    return newx;
  } else {
    return x;
  }
}

class Bird {
  constructor(brain,range){

    this.range = range;

    var oNodeCount = range[1] - range[0] + 1;
    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    }
    else {
        this.brain = new NeuralNetwork(36,72,oNodeCount);
    }

    this.prevMidiValue = 0;
    this.prevOffset = 0;

   // Score is how many frames it's been alive
    this.score = 0;
    // Fitness is normalized version of score
    this.fitness = 0;
  }
  scale(num, in_min, in_max, out_min, out_max){
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }
  // Create a copy of this bird
  copy() {
    return new Bird(this.brain,this.range);
  }
  pick(chordItem,meta) {
    ///console.log('PICK! chordItem',chordItem,'meta',meta);
      // Now create the inputs to the neural network
    let prevChord = chordItem.prev.chord;
    let currentChord = chordItem.chord;
    let nextChord = chordItem.next.chord;

    let inputs = [];
    var idx = 0;
    var prevChordBitmap = JSMT.twelveNotes().map(function(note){
      return prevChord.containsNote(note) ? 1 : 0;
    });
    var currentChordBitmap = JSMT.twelveNotes().map(function(note){
      return currentChord.containsNote(note) ? 1 : 0;
    });
    var nextChordBitmap = JSMT.twelveNotes().map(function(note){
      return nextChord.containsNote(note) ? 1 : 0;
    });
    /////////////////////
    var cNotP = currentChordBitmap.map(function(v,i){
      return (v && !prevChordBitmap[i]) ? 1 : 0;
    });
    var cNotN = currentChordBitmap.map(function(v,i){
      return (v && !nextChordBitmap[i]) ? 1 : 0;
    });

    /**
    console.table([prevChordBitmap]);
    console.table([cNotP]);
    console.table([currentChordBitmap]);
    console.table([cNotN]);
    console.table([nextChordBitmap]);
    ***/

    inputs = inputs.concat(cNotP);
    inputs = inputs.concat(currentChordBitmap);
    inputs = inputs.concat(cNotN);
    ///console.table([inputs]);

    /****
    // x position of closest pipe
    inputs[0] = map(closest.x, this.x, width, 0, 1);
    // top of closest pipe opening
    inputs[1] = map(closest.top, 0, height, 0, 1);
    // bottom of closest pipe opening
    inputs[2] = map(closest.bottom, 0, height, 0, 1);
    // bird's y position
    inputs[3] = map(this.y, 0, height, 0, 1);
    // bird's y velocity
    inputs[4] = map(this.velocity, -5, 5, 0, 1);
    *****/
    // Get the outputs from the network
    let action = this.brain.predict(inputs);



    let actionIndex = +Object.keys(action).reduce(function(a,b){
      return action[a] > action[b] ? a : b;
    });
    // Decide to jump or not!
    this.score += 1;

    var result = this.range[0] + actionIndex;
    return result;
  }

}