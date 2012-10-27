<?php

$opts = array();
$opts = array_merge($opts,$_GET);
$opts = array_merge($opts,$_POST);

if ($opts['action'] == 'chord_images') {
  $images = glob('images/chords/*');
  echo json_encode($images);
  exit;
}