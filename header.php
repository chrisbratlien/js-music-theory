<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title><?php echo apply_filters('wp_title','JSMT'); ?></title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">


     <!-- CSS -->
      <link rel="stylesheet" href="lib/jquery-ui.css">
      <link href="lib/bootstrap/css/bootstrap.css" rel="stylesheet">
      <!-- <link href="lib/bootstrap/css/bootstrap-responsive.css" rel="stylesheet">-->
    
      <link rel="stylesheet" href="style.css?v=2.1">






    <!--[if lt IE 9]>
      <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->



    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
  
  
   <header class="navbar navbar-fixed-top navbar-inverse navbar-music-player noprint" id="top" role="banner">
      <div class="container">
        <div class="was-navbar-header">
          <div class="current-song-info header-column">
            <div class="title"></div>
            <div class="artist"></div>
            <div class="album"></div>
          </div>
          
          <div class="slider-wrap header-column">
            Volume:<span id="volume-amount">0</span>
            <div class="slider" id="volume-input"></div>
          </div>
          
          
          
          
        </div><!-- navbar-header -->
      </div><!-- end .container -->
    </header>