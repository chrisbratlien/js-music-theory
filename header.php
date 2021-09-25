<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <meta name="description" content="">
  <meta name="author" content="">
  <title><?php echo apply_filters('wp_title', 'JSMT'); ?></title>
  <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">-->
  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/lib/font-awesome-4.6.3/css/font-awesome.min.css">

  <!-- CSS -->
  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/lib/jquery-ui.css">
  <link href="<?php bloginfo('url'); ?>/lib/bootstrap/css/bootstrap.css" rel="stylesheet">
  <!-- <link href="lib/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">-->


  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/css/align.css?v=2.1">
  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/css/flex.css?v=2.1">
  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/css/padding.css?v=2.1">


  <link rel="stylesheet" href="<?php bloginfo('url'); ?>/style.css?v=2.1">






  <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->



  <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <header class="navbar navbar-fixed-top navbar-inverse navbar-music-player noprint flex-row align-items-center space-between" id="top" role="banner">
    <a class="pad8-lr" href="<?php echo bloginfo('url'); ?>">&#127968;</a>

    <div class="nav-links flex-row align-items-center space-around">
    </div>
    <div class="container flex-row align-items-center space-evenly">
      Volume:<div id="volume-amount" class="volume-amount">0</div>

      <div class="slider-wrap flex-column header-column half-width">
        <div class="slider" id="volume-input"></div>
      </div>
    </div><!-- end .container -->
    <a class="pad8-lr" href="https://github.com/chrisbratlien/js-music-theory"><i class="fa fa-2x fa-github"></i></a>
  </header>