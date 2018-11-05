

 
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
  constructor(brain,range,lr){

    this.history = {
      intervalVelocity: [],
      predict: []
    };
    this.range = range;
    this.prevResult = -1;
    this.intervalVelocity = 0;
    var iNodeCount = 36; //chromatic notes for prev, cur, next chordItems
    iNodeCount += 1; //if prevResult used.
    iNodeCount += 1; //if intervalVelocity used.
    iNodeCount += 1; //chordNoteIdx used.

    var oNodeCount = range[1] - range[0] + 1 ;


    if (brain instanceof NeuralNetwork) {
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    }
    else {
        this.brain = new NeuralNetwork(iNodeCount,iNodeCount *2,oNodeCount);
        this.brain.setLearningRate(lr || 0.1);
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

  judge(result) {
    if (
      result < BSD.audioPlayer.spec.range[0] ||
      result > BSD.audioPlayer.spec.range[1] 
    ) {
        console.log('out of range!!',result);
      //this.score--;
      return "out of range";
    }

    if (Math.abs(this.intervalVelocity) > 7) {
      //this.score--;
      return "internal velocity too high";
    }
    if (this.history.intervalVelocity.length > 3 && this.intervalDistance() == 0) {
      //this.score--;
      console.log("intervalDistance too low");
      return "intervalDistance too low";
    }

    this.score++;

  }

  getScore() {
    var result = this.score;
    var runLength = longestRunLength(this.history.predict);
    result -= (runLength * runLength);

    var d = this.noteDiversity();
    result += Math.sign(d) * (d*d);

    return result;
  }



  intervalDistance() {
    var total = this.history.intervalVelocity.sum();
    var result = Math.abs(total);
    return result;
  }
  noteDiversity() {
    var hash = histogram(this.history.predict);
    var result = Object.keys(hash).length;
    return result;
  }

  pick(chordItem,chordNoteIdx) {
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
    inputs.push(this.prevResult);
    inputs.push(this.intervalVelocity);
    inputs.push(chordNoteIdx);
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

    var result = this.range[0] + actionIndex;
    this.intervalVelocity = result - this.prevResult;
    this.prevResult = result;
    this.judge(result);
    this.history.predict.push(result);
    this.history.intervalVelocity.push(this.intervalVelocity);
    return result;
  }

}