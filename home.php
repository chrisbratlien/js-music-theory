<?php
add_filter('wp_title', function ($o) {
  return 'Home';
});

add_action('wp_head', function () {
});

add_filter('body_class', function ($classes) {

  array_push($classes, 'home');

  return $classes;
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

<ul class="mobile-line-height list-style-type-none">
  <li><a href="prog-fretboards">Prog Fretboards</a>
    <ul>
      <li>Paint and play on fretboards drawn to match a chord progression</li>
      <li>Hear your external apps/gear MIDI input synthesized in the browser</li>
      <li>Hear your chord progression synthesized either in the browser or sent out as MIDI output to external apps/gear</li>
      <li>Save and load chord progressions to and from a song list</li>
    </ul>
  </li>
  <li><a href="piano-roll">Piano Roll</a> Piano Roll experiment
  <li><a href="rulers">Rulers</a> Vertical color swatches to paint and play chords and progressions with</li>
  <li><a href="hexagon">Hexagon</a> Hexagon based input UI</li>
  <li><a href="multiple-fretboards">Multiple Fretboards</a> paint and play on fretboards</li>
  <li><a href="spatial">Spatial Note Fretboard</a> arpeggios inverted to play nearby notes on the guitar fretboard </li>
  <!-- FIXME <li><a href="two-five">Two Five</a> Visualize and hover over random II-Vs</li>-->
  <li><a href="paint">Paint</a> paint onto sheet music</li>
  <li><a href="vex4">Vex4</a> VexFlow notataion from progressions sandbox</li>
  <li><a href="http://github.com/chrisbratlien/js-music-theory">js-music-theory on Github</a></li>
</ul>
<script>
function onAppLoad() {
  //FIXME: get rid of this once the app/module refactoring is done
}
    </script>


<?php

get_footer();
