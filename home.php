<?php 
  add_filter('wp_title',function($o){ return 'Home'; });

  add_action('wp_head',function(){



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

    <ul>
      <li><a href="http://github.com/chrisbratlien/js-music-theory">js-music-theory on Github</a> Fork and download the code here</li>
      <li><a href="chords.html">Chords</a> some fretbaord "flashcards" over various jazz chord names</li>
      <li><a href="guitar.html">Guitar</a> Maps fretboard for each chord change in progression. Has song list for preset progressions</li>
      <li><a href="mandolin.html">Mandolin (may be broken)</a> has mandolin tuning on its fretboard</li>
      <li><a href="palette.html">Palette</a> scratch page for various junk</li>
      <li><a href="rulers">Rulers (formerly jazz.html)</a> Toggle notes on vertical swatches and then hit the green button to play all of the toggled notes in that swatch</li>
      <li><a href="song">Song</a> plays chord progressions and gives an interactive fretboard and other viewers to play along with</li>
      <li><a href="spatial.html">Spatial Note Fretboard</a> This progression player will arpeggiate the chords in its progression, but only after first inverting the chords as much as necessary so the chord changes begin with the most "nearby" note of the new chord to the last played note of the old chord. The arpeggios rise and then fall, with an overall falling trend. 
  
  Spatially, the midpoint of the last few displayed notes on the guitar fretboard will help determine which fret, x, and which string, y, is chosen for the next note to be displayed on the fretboard. The theory is that this moving midpoint can find efficient trails on the fretboard which match the incoming sequence of notes from the arpeggiator, yet minimize fretting-hand movement for the human guitarist playing along.</li>
      <li><a href="teacher.html">Teacher</a> Guitar fretboard, shows heat map of recently played notes</li>
      <li><a href="two-five">Two Five</a> Visualize and hover over random II-Vs</li>
      <li><a href="multiple-fretboards">Multiple Fretboards</a> paint and play on fretboards</li>
      <li><a href="prog-fretboards">Prog Fretboards</a> paint and play on fretboards drawn to match a progression</li>
      <li><a href="hexagon">Hexagon</a> Hexagon inputs</li>
      <li><a href="vex4">Vex4</a> VexFlow progressions sandbox</li>
    </ul>
<?php 

get_footer();