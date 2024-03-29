export function setBackgroundHue(elem, hueRads) {
    //elem.style.backgroundColor = `hsl(${hueRads}rad,50%,50%)`;

    elem.style.background = `linear-gradient(
            to bottom, 
            hsl(${hueRads}rad,50%,60%) 0%, 
            hsl(${hueRads}rad,50%,40%) 100%
        )`;

}



export function ascendingSorter(selectorFunc) {
    var sortFunc = function(a, b) {
      var sA = selectorFunc(a);
      var sB = selectorFunc(b);
      if (sA < sB) {
        return -1;
      }
      if (sA > sB) {
        return 1;
      }
      return 0;
    };
    return sortFunc;
}
export function descendingSorter(selectorFunc) {
    var sortFunc = function(a, b) {
      var sA = selectorFunc(a);
      var sB = selectorFunc(b);
      if (sA < sB) {
        return 1;
      }
      if (sA > sB) {
        return -1;
      }
      return 0;
    };
    return sortFunc;
}
  
export function sorter(selectorFunc) {
    return ascendingSorter(selectorFunc);
}
export const ascending = ascendingSorter;
export const descending = descendingSorter;

export function tempoToMillis(bpm) {
  var minutesPerBeat = 1 / bpm;
  var secs = minutesPerBeat * 60;
  var millis = secs * 1000;
  return millis;
}

export function fretDistance(fret, other) {
  var dFrets = Math.abs(other.fret - fret.fret);
  var dStrings = Math.abs(other.string - fret.string);
  var naive = dFrets * dStrings;
  var capped = Math.max(dFrets,1) * Math.max(dStrings,1);
  ////console.log({fret, other, dFrets, dStrings, naive, naive, capped });
  return capped;
}


    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
export  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
