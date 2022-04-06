<?php

add_action('wp_head',function(){
?>
<style type="text/css">
	

.paint-wrap { 
	margin-top: 80px;
	position: relative;
}

.song-img {
	width: 100%;
	height: auto;
}
.the-canvas {
	border: 1px solid black;
	width: 100vw;
}
</style>

<?php
});

get_header();

?>
<div class="navbar-spacer screen-only noprint">
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
</div>
<button class="btn btn-info btn-undo">Undo</button>
<button class="btn btn-info btn-redo">Redo</button>
<button class="btn btn-info btn-fill-color">Fill Color</button>
<input class="fill-color" type="color" />

IMAGE URL<input class="image-url">

<select class="gco"></select>
<canvas class="the-canvas">
</canvas>


<img class="song-img" />

<?php

add_action('wp_footer',function(){
?>

<script type="module">

import DOM from "./js/DOM.js";
import PubSub from "./js/PubSub.js";

const campfire = PubSub({});


var songImg = document.querySelector('.song-img');
var myCanvas = document.querySelector('.the-canvas');
const canvasCtx = myCanvas.getContext('2d', { alpha: true });

var gco = [ 'source-over','source-in','source-out','source-atop',
            'destination-over','destination-in','destination-out','destination-atop',
            'lighter', 'copy','xor', 'multiply', 'screen', 'overlay', 'darken',
            'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light',
            'difference', 'exclusion', 'hue', 'saturation', 'color', 'luminosity'
          ];


/// https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event

let isDrawing = false;
let x = 0;
let y = 0;

myCanvas.addEventListener('mousedown', e => {
	let pos = getMousePos(myCanvas,e);
	x = pos.x;
	y = pos.y;
	isDrawing = true;
});

/*
document.getElementById(canvasName).addEventListener('mousemove', function(evt) {
    var xy = getMousePos(evt);
 
    var position = (xy.x) + ', ' + (xy.y);
 
    alert(position);
}
 */
function getMousePos(canv,evt) {
    var rect = canv.getBoundingClientRect();
 
    var X = (evt.clientX - rect.left) / (canv.clientWidth / canv.width);
    var Y = (evt.clientY - rect.top) / (canv.clientHeight / canv.height);
    X = Math.ceil(X);
    Y = Math.ceil(Y);
 
    return {
        x: X,
        y: Y
    };
}

myCanvas.addEventListener('mousemove', e => {
  if (isDrawing === true) {
	let pos = getMousePos(myCanvas,e);
	drawLine(canvasCtx, x, y, pos.x, pos.y);
	x = pos.x;
	y = pos.y;
	return false;
	drawLine(canvasCtx, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
	let pos = getMousePos(myCanvas,e);

	drawLine(canvasCtx, x, y, pos.x, pos.y);
	isDrawing = false;
	return false;
	drawLine(canvasCtx, x, y, e.offsetX, e.offsetY);
    x = 0;
    y = 0;
    isDrawing = false;
  }
});

var mode = 'highlighter';
mode = 'marker';

function drawLine(context, x1, y1, x2, y2) {

	if (mode == 'highlighter') {
		let r = canvasCtx.lineWidth;
		let rOver2 = r/2;
		context.fillRect(x1 - rOver2, y1 - rOver2, r, r);
		return false;
	}
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
	context.closePath();
}

var startColor = '#ffff77';

function setupStyle() {
	canvasCtx.lineCap = 'round';

	///const ctx = canvas.getContext('2d', {alpha: true});
        canvasCtx.globalAlpha = 0.2;
        canvasCtx.fillStyle = startColor;
        canvasCtx.strokeStyle = startColor;


		canvasCtx.globalCompositeOperation = selectedGCO;
	//canvasCtx.globalCompositeOperation = "multiply";
	//canvasCtx.globalCompositeOperation = "lighten";
	///canvasCtx.globalCompositeOperation = "lighter";

	
	//canvasCtx.strokeStyle = 'hsla(30deg,80%,80%,0.04)';
	//canvasCtx.strokeStyle = 'rgba(255,220,220,0.01)';
	//canvasCtx.fillStyle = 'hsla(240 100% 50% / .005)';
	//canvasCtx.strokeStyle = 'hsla(240 100% 50% / .005)';

	//canvasCtx.strokeStyle = 'rgba(255,220,200,0.1)';
	//canvasCtx.fillStyle = 'rgba(255,220,200,0.1)';
	///canvasCtx.fillStyle = '#ff0';
	//canvasCtx.fillStyle = 'hsla(270deg 100% 50% / 1)';

	canvasCtx.lineWidth = 60;
}

	campfire.subscribe('bootup',function(){
	
	});
	campfire.subscribe('image-dimensions',({clientWidth, clientHeight}) => {
		//console.log('dims',clientWidth,clientHeight,canvasCtx,canvas);	
		//canvas.width = clientWidth;
		//canvas.height = clientHeight;
		//canvasCtx.drawImage(songImg,0,0);
		setupStyle();

	});

	let txtImageURL = DOM.from('.image-url');

	const selGCO = DOM.from('select.gco');
	var selectedGCO = 'darken';
	canvasCtx.globalCompositeOperation = selectedGCO;
	selGCO.append(DOM.option('choose').val(null));
	selGCO.append(gco.map(opName => {
		const opt = DOM.option(opName);
		if (opName == selectedGCO) {
			opt.attr('selected',true);
		}
		return opt;
	}));
	selGCO.on('change',function(e){
		///alert(e.target.value);
		selectedGCO = e.target.value;
		canvasCtx.globalCompositeOperation = selectedGCO;

	})

	const inFillColor = DOM.from('.fill-color');
	inFillColor.val(startColor);
	inFillColor.on('change',function(e){
		///alert(e.target.value);
		canvasCtx.fillStyle = e.target.value;
		canvasCtx.strokeStyle = e.target.value;
	});

	const btnFillColor = DOM.from('.btn-fill-color');
	btnFillColor.on('click',function(){
		inFillColor.raw.dispatchEvent(new MouseEvent('click'));
	});

	txtImageURL.on('change',function(){
		songImg.src = this.value;
		//campfire.publish('image-dimensions',songImg);
	});
	songImg.src = 'images/alice-in-wonderland.png';


	songImg.onload = function() {
		console.log('onload this',this);
		canvasCtx.canvas.width = this.width;
		canvasCtx.canvas.height = this.height;
		canvasCtx.drawImage(this, 0, 0, this.width, this.height);
		campfire.publish('image-dimensions',songImg);		
	}
	setupStyle();


</script>
<?php
});

get_footer();
?>