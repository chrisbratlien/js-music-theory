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
  <li><a href="rulers">Rulers</a> Vertical colored swatches to paint and play chords, progressions</li>
  <li><a href="hexagon">Hexagon</a> Hexagon inputs</li>
  <li><a href="prog-fretboards">Prog Fretboards</a>
    <ul>
      <li>Paint and play on fretboards drawn to match a progression</li>
      <li>MIDI input and output</li>
      <li>Save and Load Song Progressions</li>
    </ul>
  </li>
  <li><a href="multiple-fretboards">Multiple Fretboards</a> paint and play on fretboards</li>
  <li><a href="spatial">Spatial Note Fretboard</a> arpeggios inverted to play nearby notes on the guitar fretboard </li>
  <li><a href="two-five">Two Five</a> Visualize and hover over random II-Vs</li>
  <li><a href="paint">Paint</a> paint onto sheet music</li>
  <li><a href="vex4">Vex4</a> VexFlow notataion from progressions sandbox</li>
  <li><a href="http://github.com/chrisbratlien/js-music-theory">js-music-theory on Github</a></li>
</ul>
<?php

get_footer();
