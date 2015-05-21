<?php

require_once('local.php');

if (!function_exists('pp')) { //Pretty Print
  function pp($obj,$label = '') {
    $data = json_encode(print_r($obj,true));
    ?>
    <style type="text/css">
      #bsdLogger {
      position: absolute;
      top: 0px;
      right: 0px;
      border-left: 4px solid #bbb;
      padding: 6px;
      background: white;
      color: #444;
      z-index: 999;
      font-size: 1.25em;
      width: 450px;
      height: 800px;
      overflow: scroll;
      }
    </style>
    <script type="text/javascript">
      var doStuff = function(){
        var obj = <?php echo $data; ?>;
        var logger = document.getElementById('bsdLogger');
        if (!logger) {
          logger = document.createElement('div');
          logger.id = 'bsdLogger';
          document.body.appendChild(logger);
        }
        ////console.log(obj);
        var pre = document.createElement('pre');
        var h2 = document.createElement('h2');
        pre.innerHTML = obj;
 
        h2.innerHTML = '<?php echo addslashes($label); ?>';
        logger.appendChild(h2);
        logger.appendChild(pre);      
      };
      window.addEventListener ("DOMContentLoaded", doStuff, false);
 
    </script>
    <?php
  }
}

function pr($obj,$label = '') {
  echo sprintf('<pre>%s: %s</pre>',$label,print_r($obj,true));
}


function curl_redirect_exec($ch, &$redirects, $curlopt_header = false) {
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $data = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($http_code == 301 || $http_code == 302) {
        list($header) = explode("\r\n\r\n", $data, 2);
        $matches = array();
        preg_match('/(Location:|URI:)(.*?)\n/', $header, $matches);
        $url = trim(array_pop($matches));
        $url_parsed = parse_url($url);
        if (isset($url_parsed)) {
            curl_setopt($ch, CURLOPT_URL, $url);
            $redirects++;
            return curl_redirect_exec($ch, $redirects);
        }
    }
    if ($curlopt_header)
        return $data;
    else {
        list(,$body) = explode("\r\n\r\n", $data, 2);
        return $body;
    }
}

function curl_get($url, array $get = array(), array $options = array())
{

  //pr($url,'url');
  //exit;

    $defaults = array(
        CURLOPT_URL => $url. (strpos($url, '?') === FALSE ? '?' : ''). http_build_query($get),
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => TRUE,
        CURLOPT_TIMEOUT => 30, // I35TIED_CURL_TIMEOUT
        CURLOPT_FOLLOWLOCATION => TRUE
    );

    $ch = curl_init();
    curl_setopt_array($ch, ($options + $defaults));

    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);    
    ///curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)");
    
    
    if( ! $result = curl_exec($ch))
    {
        trigger_error(curl_error($ch)); 
        $result = curl_error($ch);
        $result = CURL_FAILED;
    }

    ///trigger_error(curl_error($ch)); 
    
    //echo curl_error($ch);
    //return curl_error($ch);
    
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if($http_status == 404) {
      $result = CURL_404;
    }
    curl_close($ch);
    return $result;
}




function get_cached_or_fetch($cached_filename,$url,$timeout_seconds = 3600) {

  $last_modified = false;
  if (!file_exists($cached_filename)) {
    $data = curl_get($url);
    file_put_contents($cached_filename,$data);
  }

  $last_modified = filemtime($cached_filename);
  ////pp($last_modified?$last_modified:'false','last modified');

  $now = time();

  $diff = $now - $last_modified;
  //////pp($diff,'diff');

  if ($diff > $timeout_seconds) {
    $data = curl_get($url);
    file_put_contents($cached_filename,$data);
  }
  $data = file_get_contents($cached_filename);
  return $data;
}
