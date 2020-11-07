<?php

define('WEEPY_BACKUP_TEMP',DATA_PATH . '/.weepy-backup');
require_once(LIB_PATH . '/weepy-backup/weepy-backup.php');

check_ip_address();

if (!class_exists('WeepyBackup')) {
  die('WeepyBackup plugin required');
}

function get_years() {
  $result = range(2012,date('Y'));
  return $result;
}
function get_months() {
  $range = range(1,12);
  $result = array_map(function($o) {
    return substr('0' . $o,-2);
  }, $range);
  return $result;
}

add_filter('get_backup_volumes_menu',function($items){
  //array_push($items, sprintf('%s/*',UPLOADS_PATH));
  array_push($items, sprintf('%s/*db',DATA_PATH));
  return $items;
});

WeepyBackup::serve_backup_endpoint();

