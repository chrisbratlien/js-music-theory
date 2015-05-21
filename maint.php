<?php

ini_set('display_errors',1);

require_once('functions.php');
require_once('./lib/getID3-master/getid3/getid3.php');


$getID3 = new getID3;

function process($filename) {
  global $getID3;



  $artist = 'Unknown Artist';
  $album = 'Unknown Album';
  $title = 'Unknown Track';
  $track_number = 1;



  $info = $getID3->analyze($filename);
  //pp($info,'info');
  $tags = $info['tags'];
  
  if (array_key_exists('id3v2',$tags)) {
    $id3 = $tags['id3v2'];
    
    
    if (array_key_exists('album',$id3)) {
      $album = $id3['album'][0];    
    }
    else {
      pp($id3,'no album, id3v2');   
    }
    
    
    $artist = $id3['artist'][0];
    $title = $id3['title'][0];

    if (array_key_exists('track_number',$id3)) {
      $track_number = $id3['track_number'][0];    
    }
    
  }
  else if (array_key_exists('id3v1',$tags)) {
    $id3 = $tags['id3v1'];
    ///pp($id3,'id3v1');
    
    $artist = $id3['artist'][0];
    $album = $id3['album'][0];
    $title = $id3['title'][0];
    
    
    if (array_key_exists('track',$id3)) {
      $track_number = $id3['track'][0];    
    }
    else {
      pp($id3,'missing track, id3v2');   
    }


  }
  else {
    pp($filename,'doh, filename');
    pp($info,'info');
  }
  
  
  $path = sprintf("%s/data/music/library/%s/%s",dirname(__FILE__),$artist,$album);
  if (!file_exists($path)) {
    mkdir($path,0777,true);
  }
  
  
  $full_file = sprintf("%s/%'.02d-%s.mp3",$path,$track_number,$title);

  $mv = sprintf('mv %s %s',$filename,$full_file);

  pr($mv,'mv');
  pr($full_file,'full_file');



  rename($filename,$full_file);

  return $full_file;
  
}



$them = glob(sprintf('%s/data/music/incoming/*mp3',dirname(__FILE__)));

//pp($them,'them');

$first = $them[0];
$filename = $first;

///pp($filename,'filename');

// Analyze file and store returned data in $ThisFileInfo


$paths = array_map('process',$them);

pp($paths,'paths');


