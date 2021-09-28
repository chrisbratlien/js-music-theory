<?php

add_filter('wp_title',function($o){ return "Vindow Test"; });

add_action('wp_head',function(){
    $classes = apply_filters('body_class',[]);

    foreach($classes as $c) {
        $file_path = APP_PATH . '/css/' . $c .'.css';
        $uri_path = get_stylesheet_directory_uri() . '/css/' . $c . '.css';
        //pp([$file_path,$uri_path],'did it work?'); 
        if (file_exists($file_path)) {
            echo sprintf('\n<link rel="stylesheet" href="%s">',$uri_path);
        }
    }
    //pp($classes,'classes');


});

add_action('wp_head',function(){
    ?>
<style>
    @import 'css/piano-roll.css';
    @import 'css/vindow.css';

</style>
<?php
});

get_header();
?>
<section>
<br />
<br />
<br />
<div class="vindow-wrap flex-column full-width">
</div>
</section>
<?php
    
add_action('wp_footer',function() {
?>
<script type="module">

import Vindow from "./js/Vindow.js";

let v = Vindow({ title: "YAY" });
  v.renderOn(jQuery('.vindow-wrap'));


  let w = Vindow({ title: "Tile" });
  //v.append(w.ui());

  w.append([
    DOM.h1('We did it!'),
    DOM.input()
      .attr('type','range')
      .attr("min",0)
      .attr('max',10)
      .attr('step',1)
  ])

  w.on('close',function(a,b,c){
    console.log('CLOSE',a,b,c);
  })
  w.renderOn(jQuery(document.body))

</script>
<script>
function onAppLoad() {
  //FIXME: get rid of this once the app/module refactoring is done
}
  </script>
<?php    
});


get_footer();

?>