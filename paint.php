<?php

add_action('wp_head',function(){
?>
<style type="text/css">
	

.paint-wrap { 
	position: absolute;
	top: 0;
	bottom: 0;
	right: 0;	
	bottom: 0;
	width: 100%;
	height: 100%;
}

</style>

<?php
});

get_header();


?>
<div class="paint-wrap" id="wPaint">
	
</div>
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

$('#wPaint').wPaint({
  path: 'lib/wPaint/',
  image: 'data/all-of-me.png',
  imageStretch: true, //not sure this did anything...
  theme:           'standard classic', // set theme //unsure also...

	mode:        'pencil',  // set mode
	lineWidth:   '1',       // starting line width
	fillStyle:   '#FFFFFF', // starting fill style
	strokeStyle: '#AA0055'  // start stroke style  

});


</script>
<?php
});

get_footer();
?>