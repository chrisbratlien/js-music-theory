<?php 

//css
add_action('wp_head',function(){
?>


<?php
});

get_header(); ?>


<i class="fa fa-plus fa-2x"></i>YAY

<div class="boards"></div>
<div class="boards"></div>

<?php 

//js
add_action('wp_footer',function(){
?>
<script type="text/javascript">
  var context = new webkitAudioContext();
  BSD.audioContext = context;

   BSD.audioPlayer = BSD.Widgets.GuitarPlayer({
      ////gossip: campfire,
      context: context,
      ////name: 'Piano',//chosen, //'Piano',
      polyphonyCount: 48,//polyphonyCount,
      range: [-300,128]
    });
      
    var storage = BSD.Storage('JSMT::');
    
    var waiter = BSD.Widgets.Procrastinator({ timeout: 250 });


    BSD.volume = 0;
    storage.getItem('volume',function(o){
        BSD.volume = parseFloat(o);
        waiter.beg(BSD.audioPlayer,'set-master-volume',BSD.volume);
        jQuery( "#volume-amount" ).text( BSD.volume );
    });



    $( "#volume-input" ).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 0.1,
      step: 0.01,
      value: BSD.volume,
      slide: function( event, ui ) {
        var newVolume = ui.value;
        waiter.beg(BSD.audioPlayer,'set-master-volume',newVolume);
        storage.setItem('volume',newVolume);  
        ////waiter.beg(BSD.chunker,'set-master-volume',ui.value);
        jQuery( "#volume-amount" ).text( newVolume );
      }
    });


    BSD.importJSON('data/guitar.json',function(o) { 
      BSD.guitarData = o;
    });
    
    
    //makeChord('C').notes().forEach(function(note) { var frets = BSD.guitarData.select(function(f) { return f.noteValue == note.value(); }); console.log('frets',frets); })
    
    


</script>
<?php
});
get_footer(); 


