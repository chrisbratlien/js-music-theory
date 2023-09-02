<?php


global $routes;
$routes = [];

function add_route($endpoint, callable $handler){
  global $routes;
  array_push($routes,[ 
    'endpoint' => $endpoint, 
    'handler' => $handler 
  ]);
};

function route($uri) {

  global $routes;

  // start the session
  @session_start();
  header("Cache-control: private"); //IE 6 Fix
  $uri = clean_uri($uri);
  if (empty($uri) || $uri == base_uri()) {
    ////echo "HOME!!!";
    require_once('home.php');
    ///exit;
    return null;
  }
  global $path;
  $path = substr($uri,strlen(base_uri()));

  //see if we match an add_route()
  $slash_path = '/' . ltrim($path,'/');
  foreach($routes as $route) {
    $endpoint = $route['endpoint'];
    $handler = $route['handler'];
    if ($slash_path == $endpoint) {
      //got an easy match with no params.
      return call_user_func_array($handler, []);
    }
    //check for arguments
    preg_match('/{.*}/',$endpoint,$matches);
    if (empty($matches)) {
      continue; //skip. No args found. The only way this could have matched was the easy way.
    }
    $them_all = $matches[0];
    ///pp([$count,$route,$matches,$them_all,$path,$endpoint],'matches,them_all,path,endpoint');
    $vars = preg_split('/{|}|\//',$them_all);
    $vars = array_filter($vars,function($elem){
      return !empty($elem);
    });
    $tmp = $endpoint;

    $attempt = preg_replace('/{.*}/U','(.*)',$endpoint);
    $attempt = preg_replace('/\//','\/',$attempt);
    //$attempt = '/' . $attempt . '/';
    $attempt = '/^' . $attempt . '/';    
    $recipe = $attempt;
    preg_match($recipe,$slash_path,$zm);
    array_shift($zm);
    if (!empty($zm)) {
      return call_user_func_array($handler, $zm);
    }
  }


  $tests = Array(); 
  $tests[] = dirname(__FILE__) . $path . '/index.php';

  array_push($tests, sprintf('%s/endpoints/%s/index.php', APP_PATH, $path));
  array_push($tests, sprintf('%s/endpoints/%s.php', APP_PATH, $path));
  array_push($tests, sprintf('%s/endpoints/%s', APP_PATH, $path));

  array_push($tests, sprintf('%s/%s/index.php', APP_PATH, $path));
  array_push($tests, sprintf('%s/%s.php', APP_PATH, $path));
  array_push($tests, sprintf('%s/%s', APP_PATH, $path));

  //pr($path,'path');
  ///pr($tests,'tests');
  foreach($tests as $test) {
    if (file_exists($test)) {
      include_once($test);
      return null;
      ///break;
    }
  }
  error_404();

}
