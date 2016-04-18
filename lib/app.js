
function m2h(x) {
    return Math.pow(2,(x-69)/12)*440;
}

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var oscillator = audioCtx.createOscillator();


var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.

function autoCorrelate( buf, sampleRate ) {
	var SIZE = buf.length;
	var MAX_SAMPLES = Math.floor(SIZE/2);
	var best_offset = -1;
	var best_correlation = 0;
	var rms = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(MAX_SAMPLES);

	for (var i=0;i<SIZE;i++) {
		var val = buf[i];
		rms += val*val;
	}
	rms = Math.sqrt(rms/SIZE);
	if (rms<0.01) // not enough signal
		return -1;

	var lastCorrelation=1;
	for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
		var correlation = 0;

		for (var i=0; i<MAX_SAMPLES; i++) {
			correlation += Math.abs((buf[i])-(buf[i+offset]));
		}
		correlation = 1 - (correlation/MAX_SAMPLES);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation>0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > best_correlation) {
				best_correlation = correlation;
				best_offset = offset;
			}
		} else if (foundGoodCorrelation) {
			// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
			// Now we need to tweak the offset - by interpolating between the values to the left and right of the
			// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
			// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
			// (anti-aliased) offset.

			// we know best_offset >=1, 
			// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
			// we can't drop into this clause until the following pass (else if).
			var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
			return sampleRate/(best_offset+(8*shift));
		}
		lastCorrelation = correlation;
	}
	if (best_correlation > 0.01) {
		// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
		return sampleRate/best_offset;
	}
	return -1;
//	var best_frequency = sampleRate/best_offset;
}


function baseF(freq) {
 var base = 27.5;
  while(base * 2 <= freq) {
    base *= 2;
  }
  return base;
}

function ratioF(freq) {
  return freq / baseF(freq);
}

/**
function scaleRatio(oneToTwo) {
  var twoToFour = (2 * oneToTwo);
  var zeroToTwo = twoToFour - 2;
  return zeroToTwo;
}
***/

function radiansF(freq) { 
  var sR = m2h(70) / m2h(69);
  var ratio = ratioF(freq);
  return Math.log(ratio) / Math.log(sR) * Math.PI / 6;

  /////////////blah

  if (ratio == 2) { return 0; }
  var scaledRatio = scaleRatio(ratio);
  return scaledRatio * Math.PI;
}



function rad(deg) { return deg * Math.PI / 180; }

function deg(rad) { return rad * 180 / Math.PI; }
function degreesOf(rad) { return rad * 180 / Math.PI; }


$(document).ready(function () {

  var audioElement = document.getElementById('audioElement');
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  ///audioSrc.connect(audioCtx.destination);







navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

  
  if (navigator.getUserMedia) {
     console.log('getUserMedia supported.');
     navigator.getUserMedia (
        // constraints - only audio needed for this app
        {
           audio: true
        },
  
        // Success callback
        function(stream) {
           var source = audioCtx.createMediaStreamSource(stream);
           source.connect(analyser);

          var distortion = audioCtx.createWaveShaper();
          var gainNode = audioCtx.createGain();
          var biquadFilter = audioCtx.createBiquadFilter();
          var convolver = audioCtx.createConvolver();


  
           analyser.connect(distortion);
           distortion.connect(biquadFilter);
           biquadFilter.connect(convolver);
           convolver.connect(gainNode);


          oscillator.type = 'square';
          oscillator.frequency.value = 440;/////3000; // value in hertz
          oscillator.connect(gainNode);



           gainNode.gain.value = 0.005;
           gainNode.connect(audioCtx.destination);
           ////source.connect(audioCtx.destination);
           renderChart();
  
        },
  
        // Error callback
        function(err) {
           console.log('The following gUM error occured: ' + err);
        }
     );
  } else {
     console.log('getUserMedia not supported on your browser!');
  }


  var buflen = 1024;
  var buf = new Float32Array( buflen );

  var saveFreq = 0;
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  //var frequencyData = new Uint8Array(200);

  var svgHeight = '300';
  var svgWidth = '1200';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

   function __calculateFrequency(position, sampleRate, fourierFastTransformSize) {
        return position * (sampleRate / (fourierFastTransformSize * 2));
    }


  var center = { x: 200, y: 200 };///svgWidth/2, y: svgHeight/2 };



  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     
     ///.attr('y_axis',200)
     /**
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('x', function (d) {
      return d.x_axis;
     })
     .attr('y', function (d) {
      return d.y_axis;
     })
     ***/

     .attr('x',center.x)
     .attr('y',center.y)

     .attr('x_axis',center.x)
     .attr('y_axis',center.y)
     
     
     .attr('width', svgWidth / frequencyData.length - barPadding);

  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);
     analyser.getFloatTimeDomainData( buf );

     var correlatedFreq = autoCorrelate(buf,audioCtx.sampleRate);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        /**
        .attr('x',center.x)
        .attr('y',center.y)
        ***/
        /***
        .attr('x',function(d){
          return 20;
        
        })
        .attr('y', function(d) {
        
          return 20;
           ///return svgHeight - d;
        })
        ****/
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d) {
        
          var red = 3 * d;
          var green = 2 * d;
          var blue =   d;
          
          ///console.log('d',d);
        
           return 'rgb(' + red + ',' + green + ',' + blue + ')';
        })
        .attr('transform',function(d,i) {
          var freq = __calculateFrequency(i,audioCtx.sampleRate,analyser.fftSize);
          if (freq < 40) { return 'rotate(0)'; }
          
          ///freq = correlatedFreq;
          
          var finalFreq = (0.8 * freq) + (0.2 * saveFreq);          
          saveFreq = finalFreq;
          

          
          
          var rad = radiansF(finalFreq); ///getRadiansOfFrequency(freq);
          var deg = degreesOf(rad);
          return 'rotate(' + deg + ',' + center.x + ',' + center.y + ')';
        });
        
        
  }

  // Run the loop
  ////renderChart();

});
