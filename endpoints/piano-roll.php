<?php

get_header();
?>
<section>
<br />
<br />
<br />
    what is this?
</section>
<?php
    
add_action('wp_footer',function() {
?>
<script type="module">

import FreakySeq from "./js/FreakySeq.js";
import PianoRoll from "./js/PianoRoll.js";


</script>
<script>
    function onAppLoad() {
        //do stuff...
    }
</script>
<?php    
});


get_footer();

?>