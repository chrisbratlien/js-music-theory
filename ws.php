<?php

ini_set('display_errors',1);

  require_once('functions.php');

$opts = array();
$opts = array_merge($opts,$_GET);
$opts = array_merge($opts,$_POST);

if ($opts['action'] == 'chord_images') {
  $images = glob('images/chords/*');
  echo json_encode($images);
  exit;
}


if ($opts['action'] == 'wave_tables') {
  $s = glob('wave-tables/*');
  $filtered = array_map(function($i) { return substr($i,12); },$s);
  echo json_encode($filtered);
  exit;
}


//catch-all, eventually do all this with this hook.
do_action(sprintf('ws_%s',$opts['action']),$opts);
echo "UH OH";  









