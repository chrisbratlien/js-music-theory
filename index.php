<?php
require_once('functions.php'); //necessary for templates to call get_header()
route(clean_uri($_SERVER['REQUEST_URI']));
?>