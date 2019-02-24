<?php 

require_once('local.php');

$weepy_actions = array();
$weepy_filters = array();


function bloginfo($param) {
  echo get_bloginfo($param);
}


function clean_uri($uri) {
  $result = preg_replace('/\/$/','',$uri);
  $result = preg_replace('/\?.*$/','',$result);
  return $result;
}


function route($uri) {


  $uri = clean_uri($uri);
  
  //print_r($uri);
  //exit;
  
  
  if ($uri == base_uri()) {
    ////echo "HOME!!!";
    require_once('home.php');
    return null;
  }

  //pp('URI: ' . $uri);  
  //pp('base_uri: ' . base_uri());
  $path = substr($uri,strlen(base_uri()));
  /////pp('path: ' . $path);
  //pp('dirname: ' . dirname(__FILE__));
  
  $path = ltrim($path,'/');
  
  $tests = Array();  

  array_push($tests,sprintf('%s/endpoints/%s/index.php',APP_PATH,$path));
  array_push($tests,sprintf('%s/endpoints/page-%s.php',APP_PATH,$path));
  array_push($tests,sprintf('%s/endpoints/%s.php',APP_PATH,$path));

  array_push($tests,sprintf('%s/%s/index.php',APP_PATH,$path));
  array_push($tests,sprintf('%s/page-%s.php',APP_PATH,$path));
  array_push($tests,sprintf('%s/%s.php',APP_PATH,$path));
  
  
  /**  
  $tests[] = dirname(__FILE__) . $path . '/index.php';
  $tests[] = dirname(__FILE__) . $path . '.php';
  $tests[] = dirname(__FILE__) . $path . '.php';
  ***/
  
  
  foreach($tests as $test) {
  
    //print_r($test);
    //print "<br/>";
  
    if (file_exists($test)) {
      ///pp('it exists!!!');
      include_once($test);
      return null;
      ///break;
    }
  }
  require_once('404.php');
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

function add_action($tag,$fn) {
  global $weepy_actions;
  
  if (!array_key_exists($tag,$weepy_actions)) {
    $weepy_actions[$tag] = Array();
  }
  $weepy_actions[$tag][] = $fn;
}


function do_action($tag,$arg = '') {
  global $weepy_actions;
  if (!array_key_exists($tag,$weepy_actions)) { return false; }
  $funcs = $weepy_actions[$tag];
  if (!empty($funcs)) {
    foreach($funcs as $func) {
      call_user_func($func,$arg);    
    }
  }
}



function add_filter($tag,$fn) {
  global $weepy_filters;
  
  if (!array_key_exists($tag,$weepy_filters)) {
    $weepy_filters[$tag] = Array();
  }
  $weepy_filters[$tag][] = $fn;
}

function apply_filters($tag,$default) {
  global $weepy_filters;
  
  if (!array_key_exists($tag,$weepy_filters)) { return $default; }
  $funcs = $weepy_filters[$tag];

  $result = $default;

  if (!empty($funcs)) {
    foreach($funcs as $func) {
      $result = call_user_func($func,$result);    
    }
  }  
  return $result;
}

function body_class() {
  $uri = clean_uri($_SERVER['REQUEST_URI']);
  $parts = preg_split('/\//',$uri);
  //pp($parts,'parts');
  
  $parts = apply_filters('body_class',$parts);
  if (empty($parts)) {
    return false;
  }
  
  $class_str = trim(join(' ',$parts));
  //pp($class_str,'class_str');
  echo sprintf('class="%s"',$class_str);
}