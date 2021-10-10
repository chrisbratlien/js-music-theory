<?php


function get_bloginfo(string $key = '') {
  return getenv('BLOGINFO_URL');
  ////return 'http://localhost';
}

function get_home_url() {
  $url = get_bloginfo();
  $browsed_host_and_port = $_SERVER['HTTP_HOST'];
  if (strstr($url,'localhost')) {
    $url = preg_replace('/localhost:\d+/',$browsed_host_and_port,$url);
    //$url = str_replace('localhost',$host,$url);
  }
  return $url;
}

function home_url() {
  echo get_home_url();
}









function base_uri() {
  return clean_uri(getenv('BASE_URI'));
}

if (boolval(getenv('DEBUG'))) {
	ini_set('display_errors',1);
	error_reporting(E_ALL);
}