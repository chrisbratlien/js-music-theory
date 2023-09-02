<?php

ini_set('upload_max_filesize','20M');
ini_set('post_max_size','20M');

add_route('/remote-storage/get-item', function() {
  $key = $_GET['key'] ?? false;
  $val = remote_db_get($key);
  header('Content-Type: text/plain');  
  echo $val;
});

add_route('/remote-storage/remove-item', function() {
  $data = file_get_contents('php://input');
  $opts = json_decode($data);
  remote_db_remove($opts->key);
});

add_route('/remote-storage/set-item', function() {
  $data = file_get_contents('php://input');
  $opts = json_decode($data);
  ///pr($opts,'opts');
  remote_db_set($opts->key, $opts->value);
});