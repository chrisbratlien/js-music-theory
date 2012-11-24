  function probablyTrue(prob) {
    var res = Math.random();
    return (res < prob); 
  }
  
  function prob(prob,funcTrue,funcFalse) {
    return probablyTrue(prob) ? funcTrue() : funcFalse();
  }


