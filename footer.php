  <script type="text/javascript">
    var x = 1;
    if (typeof BSD == "undefined") {
      var BSD = {};
    }
    //this works great when installed at the apex, but not at a subdirectory
    //BSD.baseURL = window.location.origin;

    //should work better for a subdirectory install.
    BSD.baseURL = `<?php home_url(); ?>`;
  </script>

  </script>


  <script src="<?php home_url(); ?>/lib/jquery-1.11.2.min.js"></script>
  <script src="<?php home_url();  ?>/lib/jquery-migrate-1.2.1.min.js"></script>
  <script src="<?php home_url();  ?>/lib/jquery-ui.js"></script>
  <!--<script src="lib/jquery-ui-touch-punch/jquery-ui-touch-punch.min.js"></script>-->


  <!--
  <script src="lib/require.js"></script>
  -->

  <script src="<?php home_url();  ?>/lib/bootstrap/js/bootstrap.min.js"></script>

  <script src="<?php home_url();  ?>/js/array.js"></script>
  <script src="<?php home_url();  ?>/js/color.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.pubsub.js"></script>



  <!--<script src="<?php home_url();  ?>/js/js-music-theory.js"></script>-->
  <script src="<?php home_url();  ?>/js/bsd.widgets.baseplayer.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.stringoscillator.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.guitarplayer.js"></script>



  <!-- may try out some variations on eachify -->
  <script src="<?php home_url();  ?>/js/eachify.js"></script>
  <script src="<?php home_url();  ?>/js/draggy.js"></script>
  <script src="<?php home_url();  ?>/js/sticky-note.js"></script>

  <!--<script src="lib/JavaScript-ID3-Reader/dist/id3-minimized.js"></script>-->
  <!-- <script src="lib/Kali/build/kali.js"></script>-->

  <script src="<?php home_url();  ?>/js/bsd.storage.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.remotestorage.js"></script>
  <script src="<?php home_url();  ?>/js/bsd.widgets.procrastinator.js"></script>
  <script src="<?php home_url();  ?>/js/main.js" type="module"></script>
  <script src="<?php home_url();  ?>/js/bootup.js?v=22"></script>


  <?php wp_footer(); ?>
  </body>

  </html>