<?php
add_filter('wp_title', function ($o) {
  return 'Home';
});

add_action('wp_head', function () {
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
<h3>Links</h3>
<li><a href="http://github.com/chrisbratlien/js-music-theory">js-music-theory on Github</a> Fork and download the code here</li>

<ul class="mobile-line-height list-style-type-none">
  <li><a href="rulers">Rulers</a> Vertical colored swatches to paint and play chords, progressions</li>
  <li><a href="prog-fretboards">Prog Fretboards</a>
    <ul>
      <li>Paint and play on fretboards drawn to match a progression</li>
      <li>MIDI input and output</li>
      <li>Save and Load Song Progressions</li>
    </ul>

  <li><a href="spatial.html">Spatial Note Fretboard</a> This progression player will arpeggiate the chords in its progression, but only after first inverting the chords as much as necessary so the chord changes begin with the most "nearby" note of the new chord to the last played note of the old chord. The arpeggios rise and then fall, with an overall falling trend.

    Spatially, the midpoint of the last few displayed notes on the guitar fretboard will help determine which fret, x, and which string, y, is chosen for the next note to be displayed on the fretboard. The theory is that this moving midpoint can find efficient trails on the fretboard which match the incoming sequence of notes from the arpeggiator, yet minimize fretting-hand movement for the human guitarist playing along.</li>
  <li><a href="two-five">Two Five</a> Visualize and hover over random II-Vs</li>
  <li><a href="multiple-fretboards">Multiple Fretboards</a> paint and play on fretboards</li>
  <li><a href="paint">Paint</a> paint</li>
  <li><a href="mandolin-fretboards">Mandolin Fretboards</a> paint and play on fretboards drawn to match a progression</li>
  <li><a href="hexagon">Hexagon</a> Hexagon inputs</li>
  <li><a href="vex4">Vex4</a> VexFlow progressions sandbox</li>
</ul>
<?php

get_footer();
