<?php 

add_action('wp_head',function(){
?>
<style type="text/css">

  .foo img { width: 100%; }
  input { width: 100%; }

</style>
<?php
});

get_header(); 

add_action('wp_footer',function() {
?>
<script type="text/javascript">
  function getChordImages(cb) {
    jQuery.ajax({ type: 'POST', url: 'ws', data: { action: 'chord_images' }, 
      success: function(r) { cb( eval( '(' + r + ')' )) } });
  }



  BSD.Widgets.Riffer = function(spec) {
  
    var self = {};
    var map = {};
    
    map['1M7'] = '1,3,5,7';

    map['17'] = '1,3,5,b7';


    map['27'] = '2,4#,6,1';

    map['2m7'] = '2,4,6,1';
    map['2-7'] = '2,4,6,1';

    map['37'] = '3,5#,7,2';


    map['3-7'] = '3,5,7,2';
    map['3m7'] = '3,5,7,2';

    map ['4M7'] = '4,6,1,3';

    map ['47'] = '4,6,1,b3';


    map['57'] = '5,7,2,4';

    map['67'] = '6,1#,3,5';
    map['67#9'] = '6,1#,3,5,1';



    map['6m7'] = '6,1,3,5';
    map['6-7'] = '6,1,3,5';
        
    self.go = function(progression) {    
      var chords = progression.split(',');
      console.log('chords',chords);
      chords.each(function(chord) {
        if (typeof map[chord] == 'undefined') {
          console.log('buggy=>',chord);
        }
      
        console.log(chord, ' -> ',map[chord]);
      });
    };        
    return self;
  };



  var stage = DOM.div().addClass('stage');

  var riffer = BSD.Widgets.Riffer({});
  
  

  var input = DOM.input().addClass('progression').attr('type','text');
  input.blur(function() {
    riffer.go(input.val());
  
  
  });
  stage.append(input);


  var buttonMaxWidth = DOM.button('100% width images').click(function(){
    jQuery('img').css('width','100%');
  });
  stage.append(buttonMaxWidth);





  getChordImages(function(them) {
  
  
    '7,-7,M7,9,-9,M9,13,-13,M13,-7b5,6,7+9,7b9,o7'.split(',').each(function(name) {
      var length = name.length;
      //console.log(name,length);
      var subset = them.select(function(filename) { 

        var rxs = '^images/chords/' + name.replace('+','\\+') + '_';      
        //console.log(rxs);
        var rx = RegExp(rxs);
        return filename.match(rx);
      });
      
      ///console.log('name',name,'subset',subset);

      stage.append(DOM.h1(name));
      subset.each(function(url) {
        stage.append(DOM.img().attr('src',url));    
      });
    });
  });
  
  jQuery('body').append(stage);

</script>
<?php 
});

get_footer(); 
