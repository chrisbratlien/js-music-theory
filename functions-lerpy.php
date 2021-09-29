<?php


function clamp01($t) {
  $t = max(0, $t);
  $t = min($t, 1);
  return $t;
}

function lerp($a, $b, $t, $clamp = false) {
  if ($clamp) {
    $t = clamp01($t);
  }
  $result = (1 - $t) * $a + $t * $b;
  return $result;
}

function invlerp($a, $b, $v, $clamp = false) {
  $t = ($v - $a) / ($b - $a);
  if (!$clamp) {
    return $t;
  }
  $t = clamp01($t);
  return $t;
}

function remap($iMin, $iMax, $oMin, $oMax, $v, $clamp = false) {
  $t = invlerp($iMin, $iMax, $v, $clamp);
  $result = lerp($oMin, $oMax, $t); //don't reclamp here.
  return $result;
}
