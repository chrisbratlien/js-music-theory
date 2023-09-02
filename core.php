<?php

$weepy_actions = array();
$weepy_filters = array();


function bloginfo($param) {
  echo get_bloginfo($param);
}


function clean_uri($uri) {
  $result = preg_replace('/\/$/', '', $uri);
  $result = preg_replace('/\?.*$/', '', $result);
  return $result;
}




function get_header() {
  require_once('./header.php');
}
function get_footer() {
  require_once('./footer.php');
}

function wp_head() {
  do_action('wp_head');
}

function wp_footer() {
  do_action('wp_footer');
}

function add_action($tag, $fn) {
  global $weepy_actions;

  if (!array_key_exists($tag, $weepy_actions)) {
    $weepy_actions[$tag] = array();
  }
  $weepy_actions[$tag][] = $fn;
}


function do_action($tag, $arg = '') {
  global $weepy_actions;
  if (!array_key_exists($tag, $weepy_actions)) {
    return false;
  }
  $funcs = $weepy_actions[$tag];
  if (!empty($funcs)) {
    foreach ($funcs as $func) {
      call_user_func($func, $arg);
    }
  }
}



function add_filter($tag, $fn) {
  global $weepy_filters;

  if (!array_key_exists($tag, $weepy_filters)) {
    $weepy_filters[$tag] = array();
  }
  $weepy_filters[$tag][] = $fn;
}

function apply_filters($tag, $default) {
  global $weepy_filters;

  if (!array_key_exists($tag, $weepy_filters)) {
    return $default;
  }
  $funcs = $weepy_filters[$tag];

  $result = $default;

  if (!empty($funcs)) {
    foreach ($funcs as $func) {
      $result = call_user_func($func, $result);
    }
  }
  return $result;
}

function body_class() {

  $parts = apply_filters('body_class', []);
  if (empty($parts)) {
    return false;
  }

  $class_str = trim(join(' ', $parts));
  //pp($class_str,'class_str');
  echo sprintf('class="%s"', $class_str);
}


function error_header($code, $msg = 'Error unspecified') {
  header("HTTP/1.0 $code $msg");
  die($msg);
}
function error_404() {
  return error_header(404,'Not Found');
}