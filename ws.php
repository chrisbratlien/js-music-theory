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


function slugify_string($str) {
  $result = strtolower($str);
  $result = preg_replace('/\ /','-',$result);
  $result = preg_replace('/\//','-',$result);
  $result = preg_replace('/\:/','-',$result);
  $result = preg_replace('/\./','-',$result);
  $result = preg_replace('/\-+/','-',$result);
  return $result;
}


if ($opts['action'] == 'get_audio') {
  $url = $opts['url'];
  $slug = slugify_string($url);
  
  if (preg_match('/lucid|localhost/',$url)) {
    header('location: ' . $url);
    exit;
  }
  if (preg_match('/localhost/',$url)) {
    header('location: ' . $url);
    exit;
  }
  
  $seconds_per_day = 86400;
  
  ///$response = get_cached_or_fetch(sprintf('%s/data/cached-%s',dirname(__FILE__),$slug),$url,1);
  
  $response = curl_get($url);
  
  echo $response;
  exit;
}




if ($opts['action'] == 'get_songs') {

  $them = glob(sprintf('%s/data/music/library/*/*/*.mp3',dirname(__FILE__)));
  
  $them = array_map(function($o) {
    $filtered = preg_replace('/^.*data\/music\/library/',sprintf('%s/data/music/library',get_bloginfo('url')),$o);
    return $filtered;
  },$them);
  echo json_encode($them);
  exit;
}
















