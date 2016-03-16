<?php 


add_filter('wp_title',function($o){ return '12 Fretboards'; });
add_action('wp_head',function(){
?>
<title>12 Fretboards</title>

<style type="text/css">
  body { font-size: 10px;
  }
  .inner { font-size: 10px; width: 45%; margin-left: 2%; float: left; }
  table { 
  border-bottom: 1px solid rgba(0,0,0,0.5); }
  table { border-right: 1px solid  rgba(0,0,0,0.5); }
  table td { 
    padding: 0.2em; text-align: center; 
    width: 1.7em;
    height: 1.5em;    
    text.align: center;
  }
  table td { border-top: 1px solid  rgba(0,0,0,0.5); }
  table td { border-left: 1px solid  rgba(0,0,0,0.5); }
  .fretboard-table { margin-bottom: 1.75em; }    
  .stage { width: 90%; margin-left: 5%; }
  
  .cell { cursor: pointer; }
  table td { cursor: pointer; }
  
  .navbar { display: none; }

  @media print  { 
    .stage { color: rgba(0,0,0,0.5); }
  
  }
  
 
     
  
  

</style>

<?php
});

get_header(); ?>


<div class="color-pickers-wrap noprint">

      <button id="more-palettes">Redraw Palettes</button>
      <div id="pickers">   </div><!-- pickers -->
      <div id="selected-colors">   </div>
      <div style="clear: both;">&nbsp;</div>        

</div><!-- color-pickers-wrap -->


<div class="stage"></div>

<?php

add_action('wp_footer',function(){
?>
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/array.js"></script>
    <script type="text/javascript" src="http://cdn.dev.bratliensoftware.com/javascript/dom.js"></script>
    <script src="http://cdn.dev.bratliensoftware.com/javascript/color.js"></script>
    
    <script src="http://lucid.bratliensoftware.com/js-music-theory/javascript/js-music-theory.js"></script>
    <script type="text/javascript">




      BSD.chosenColor = BSD.colorFromHex('#888888');
      BSD.ColorPicker = function(spec) {
        var self = BSD.PubSub({});
        self.renderOn = function(wrap) {
      ///console.log('hello');
          var square = DOM.div('').addClass('color-picker');
          square.css('background-color','#' + spec.color.toHex());
          
          var handler = function() {
            BSD.chosenColor = spec.color;
          };
          
          square.click(function() {
            self.publish('click',spec.color);
            ////handler();
            ///var newGuy = square.clone();
            //newGuy.click(handler);
            //wrap.append(newGuy);    
          });
      ////console.log('html',html);
          wrap.append(square);
        };
        return self;
      };







      var pickers = jQuery('#pickers');
      var selectedColors = jQuery('#selected-colors');
      
      var morePalettes = jQuery('#more-palettes');
      
      var palettes = [];
      
      campfire.subscribe('redraw-palettes',function(){
        pickers.empty();
        palettes = [];
        palettes.push(BSD.colorFromHex('000000').upTo(BSD.colorFromHex('FFFFFF'),20));
        palettes.push(BSD.randomPalette2(10,60));
        palettes.push(BSD.randomPalette2(10,60));
        palettes.push(BSD.randomPalette2(10,60));
        palettes.push(BSD.randomPalette2(10,50));
        palettes.push(BSD.randomPalette2(10,40));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.push(BSD.randomPalette2(10,30));
        palettes.each(function(pal) {
          pal.each(function(randcolor) { 
            var picker = BSD.ColorPicker({ color: randcolor});
            picker.renderOn(pickers);
            picker.subscribe('click',function(color){
              BSD.chosenColor = color;    
              picker.renderOn(selectedColors);
            });
          });
        });
      });
      
      morePalettes.click(function(){
        campfire.publish('redraw-palettes');
      });
      campfire.publish('redraw-palettes');

      var cscale = makeScale('Cmajor');
      var noteNames = cscale.noteNames();
      
      function makeTable(wrap) {
        
        var inner = DOM.div().addClass('inner');
        
       var table = DOM.table().addClass('fretboard-table');
      table.attr('cellspacing',0);
      table.attr('cellpadding',0);
        
        table.empty();
      
      
      //console.log('cscale',cscale);
          [64,59,55,50,45,40].each(function(open) { 
            var row = DOM.tr();     [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].each(function(fret){ 
              
              var cell = DOM.td();
              var note = Note(open+fret);
             
              var noteName = note.name();
              
              
              if (true || noteNames.indexOf(noteName) > -1) {
                
                cell.html(noteName);
                
              }
              
              cell.click(function(){
                var hex = BSD.chosenColor.toHex();
                console.log('hex',hex);
                cell.css('background-color','#' + hex);
                cell.css('color','white');
              });
        
              row.append(cell);
              //console.log(note.name());
            });
            table.append(row);
          });
        inner.append(table);
        wrap.append(inner);
        }
      
      
      for (var i = 0; i < 12 ; i++) {
        makeTable(jQuery('.stage'));
      }
    </script>
<?php
});

get_footer();