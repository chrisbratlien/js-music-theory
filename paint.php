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
<div class="paint-wrap" id="wPaint">	
</div>

<img class="song-img" />

<?php

add_action('wp_footer',function(){
?>



<!-- wColorPicker -->
<link rel="Stylesheet" type="text/css" href="lib/wColorPicker/wColorPicker.min.css" />
<script type="text/javascript" src="lib/wColorPicker/wColorPicker.min.js"></script>


<link rel="Stylesheet" type="text/css" href="lib/wPaint/wPaint.min.css" />
<script type="text/javascript" src="lib/wPaint/wPaint.min.js"></script>
<script type="text/javascript" src="lib/wPaint/plugins/main/wPaint.menu.main.min.js"></script>
<script type="text/javascript" src="lib/wPaint/plugins/text/wPaint.menu.text.min.js"></script>
<script type="text/javascript" src="lib/wPaint/plugins/shapes/wPaint.menu.main.shapes.min.js"></script>
<script type="text/javascript" src="lib/wPaint/plugins/file/wPaint.menu.main.file.min.js"></script>
<script>


var songImg = document.querySelector('.song-img');



	campfire.subscribe('bootup',function(){

		$('#wPaint').wPaint({
		path: 'lib/wPaint/',
		//image: 'images/all-of-me.png',
		image: songImg.src,
		//image: 'images/beautiful-love.png',
		imageStretch: true, //not sure this did anything...
		theme:           'standard classic', // set theme //unsure also...

		//mode:        'pencil',  // set mode
		mode:        'text',  // set mode
		lineWidth:   '1',       // starting line width
		fillStyle:   '#3399FF',//'#BB0088', // starting fill style
		strokeStyle: '#AA0055',  // start stroke style  


		fontSize: '14',    // current font size for text input
		fontFamily: 'Arial', // active font family for text input
		fontBold: false,   // text input bold enable/disable
		fontItalic: false,   // text input italic enable/disable
		fontUnderline: false,    // text input italic enable/disable

		saveImg: function(o) {
			////console.log('o',o);
			campfire.publish('save-image',o);

		}


		});

		var btnUndo = jQuery('.btn-undo');
		var btnRedo = jQuery('.btn-undo');


		btnUndo.click(function(){
		$('#wPaint').wPaint('undo');
		});

		btnRedo.click(function(){
		$('#wPaint').wPaint('redo');
		});

		campfire.subscribe('save-image',function(imageData){
			window.open(imageData);
		});
		jQuery(window).resize(function(){
		//alert('resize');
		//$("#wPaint").wPaint('resize');		
		});




	});

	songImg.src = 'images/alice-in-wonderland.png';
	setTimeout(function() {
		jQuery('.paint-wrap').css('width',songImg.clientWidth);
		jQuery('.paint-wrap').css('height',songImg.clientHeight);
		campfire.publish('bootup');


	},1000);



</script>
<?php
});

get_footer();
?>