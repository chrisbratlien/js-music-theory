<?php

function get_bloginfo($key) {
  return getenv('BLOGINFO_URL');
}

function base_uri() {
  return clean_uri(getenv('BASE_URI'));
}

if (boolval(getenv('DEBUG'))) {
	ini_set('display_errors',1);
	error_reporting(E_ALL);
}