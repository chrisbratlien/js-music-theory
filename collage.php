<?php 

add_filter('wp_title',function($o){ return 'Collage'; });
add_action('wp_head',function(){
?>
<title>Collage</title>
<style type="text/css">
  body { 
    font-size: 10px;
  }

  .inner { font-size: 10px; width: 45%; margin-left: 2%; float: left; }
  .inner table { float: left; }
  .inner .controls { float: left; }

  #pickers { width: 100%; height: 200px; overflow: auto; }
  .color-picker { width: 2em; height: 2em; float: left; cursor: pointer;  border: 1px solid white; }
  

#quiz-output .note { font-size: 3em; }

input#url { padding: 3px; font-size: 1.2em; }
#work-area { position: absolute; left: 0px; right: 100px; height: 100%;   border: 1px solid grey; }

.rnd { 
    display: inline-block;
    resize: both;
    overflow: auto;
    border: 3px solid red;
 }

div.resizable{
    resize:both;
    overflow: auto;
    border: 1px solid #000;
}


.rnd img {
  width: 90%;
}

#thumbs { height: 100%; position: absolute; right: 0; top: 0; bottom: 0; width: 100px; }
#thumbs img { width: 100%; }

</style>
<?php  
});

get_header();
?>
<div class="navbar-spacer screen-only noprint">
  <br />
  <br />
  <br />
  <br />
  <br />
  <br />
</div>
<div class="color-pickers-wrap noprint">
      <button id="more-palettes">Redraw Palettes</button>
      <div id="pickers">   </div><!-- pickers -->
      <div id="selected-colors">   </div>
      <div style="clear: both;">&nbsp;</div>        

</div><!-- color-pickers-wrap -->
  <div id="container">
    Image URL <textarea id="url"></textarea>
    <br />
    <div id="work-area"></div>
    <div id="thumbs"></div>
  </div><!-- container -->
<?php

add_action('wp_footer',function(){
?>
<script type="text/javascript">


function resizableStart(e){
    //console.log('boom');
    this.originalW = this.clientWidth;
    this.originalH = this.clientHeight;
    this.onmousemove = resizableCheck;
    this.onmouseup = this.onmouseout = resizableEnd;
}
function resizableCheck(e){
  ///console.log('bap');

    if(this.clientWidth !== this.originalW || this.clientHeight !== this.originalH) {
        this.originalX = e.clientX;
        this.originalY = e.clientY;
        this.onmousemove = resizableMove;
    }
}
function resizableMove(e){
    ///console.log('ping',e);
    var newW = this.originalW + e.clientX - this.originalX,
        newH = this.originalH + e.clientY - this.originalY;
    if(newW < this.originalW){
        this.style.width = newW + 'px';
    }
    if(newH < this.originalH){
        this.style.height = newH + 'px';
    }
}
function resizableEnd(){
    ///console.log('tsss');
    this.onmousemove = this.onmouseout = this.onmouseup = null;
}





BSD.Image = function(spec) {
  var self = BSD.PubSub({});
  self.spec = spec;
  self.renderOn = function(wrap) {
    var div = DOM.div().addClass('rnd resizable');

      div.on('mouseover',resizableStart);

    ////div.css('display','inline-block');
    var img = DOM.img().attr('src',spec.url);
    div.append(img);


    /***
    img.resizable({
      resize: function(event,ui){
        console.log('ui',ui);
        console.log('event',event);      
      }
    });
    ***/


    /*
    div.draggable({
      appendTo: 'body',
      start: function(event, ui) {
        isDraggingMedia = true;
      },
      stop: function(event, ui) {
        isDraggingMedia = false;
        // blah
      }
    });
    */


    //div.find('.ui-wrapper').css('height','50px');
    //div.find('.ui-wrapper').css('width','50px');
    //img.css('height','50px');
    //img.css('width','50px');
    
    
    wrap.append(div);
  };    

  return self;
};



BSD.Thumb = function(spec) {
  var self = BSD.PubSub({});
  self.spec = spec;

  var img = DOM.img().attr('src',spec.url);
  self.img = img;
  var rawImg = img.get(0);
  self.rawImg = rawImg;
  
  self.renderOn = function(wrap) {
    
    img.on('click',function(){
      self.publish('click',self);    
    });
    wrap.append(img);
  };
  
  self.dataClone = function() {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = rawImg.width;
    canvas.height = rawImg.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(rawImg, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL();///"image/png");

    var result = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    return result;
  }
  
  
  
  
  

  return self;
};


// Code taken from MatthewCrumley (http://stackoverflow.com/a/934925/298479)
function getBase64Image(img) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    // Copy the image contents to the canvas
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    // Get the data-URL formatted image
    // Firefox supports PNG and JPEG. You could check img.src to guess the
    // original format, but be aware the using "image/jpg" will re-encode the image.
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}



var storage = BSD.Storage('JSMT::');
var imageSpecs = JSON.parse(storage.getItem('image-specs')) || [];
var thumbSpecs = JSON.parse(storage.getItem('thumb-specs')) || [];
var images = imageSpecs.map(function(o){ return BSD.Image(o); });
var thumbs = thumbSpecs.map(function(o){ return BSD.Thumb(o); });
var workArea = jQuery('#work-area');
var thumbsWrap = jQuery('#thumbs');
var urlInput = jQuery('#url');

var campfire = BSD.PubSub({});
campfire.subscribe('work-on-image',function(url){
  if (url.length == 0) { return false; }

  var image = BSD.Image({ 
    url: url
  });
  images.push(image);
  image.renderOn(workArea);  
  
 
  var thumb = BSD.Thumb({ url: url });
  
  
  var hit = thumbs.detect(function(o){ return o.spec.url == url; });
  if (!hit) {
    thumb.renderOn(thumbsWrap); 
    thumbs.push(thumb); 
    thumbSpecs = thumbs.map(function(o){ return o.spec; });
    //storage.setItem('thumb-specs',JSON.stringify(thumbSpecs));
  }
  
  var imageSpecs = images.map(function(o){ return o.spec; });
  ///storage.setItem('image-specs',JSON.stringify(imageSpecs));


});

urlInput.change(function(){
  console.log('this.innerText',this.innerText);
  console.log('this.value',this.value);
  console.log('itl',this.innerText.length);
  console.log('vl',this.value.length);
  campfire.publish('work-on-image',this.value);
});


thumbs.each(function(thumb){
    thumb.renderOn(thumbsWrap);
    thumb.subscribe('click',function(o){
      campfire.publish('work-on-image',o.spec.url);
    });
});





if (typeof BSD == "undefined") {
  var BSD = {};    
}
BSD.chosenColor = BSD.colorFromHex('#000000');
BSD.ColorPicker = function(spec) {
  var self = {};
  self.renderOn = function(html) {
///console.log('hello');
    var square = DOM.div('').addClass('color-picker');
    square.css('background-color','#' + spec.color.toHex());
    square.click(function() {
      BSD.chosenColor = spec.color;
    });
////console.log('html',html);
    html.append(square);
  };
  return self;
};
  
  
  
  var pickers = jQuery('#pickers');
  var palettes = [];
  palettes.push(BSD.randomPalette2(20,60));
  palettes.push(BSD.randomPalette2(20,50));
  palettes.push(BSD.randomPalette2(20,40));
  palettes.push(BSD.randomPalette2(20,30));
  palettes.push(BSD.randomPalette2(20,30));
  palettes.push(BSD.randomPalette2(20,30));
  palettes.each(function(pal) {
    pal.each(function(randcolor) { 
    var picker = BSD.ColorPicker({ color: randcolor});
    picker.renderOn(pickers);
    });
  });

  //var degreeStr = $('#include_degrees-' + id).val();
  //zz id = fretboardID.replace(/fretboard-/,'');
  ////var degrees = include_degrees(id);
  //console.log(scalesByDegree.length);
  
  
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}


var els = document.getElementsByClassName('resizable');
for(var i=0, len=els.length; i<len; ++i){
    console.log('got here');
    els[i].onmouseover = resizableStart;
}



</script>  
<?php
});

get_footer();