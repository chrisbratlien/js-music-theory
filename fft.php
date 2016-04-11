<!DOCTYPE html>
<html lang="en-us">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>Voice-change-O-matic</title>
	
	<!--[if le IE 9]>
      <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
      <script src="scripts/respond.js"></script>
    <![endif]-->
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
	  <link href="styles/normalize.css" rel="stylesheet" type="text/css">
    <link href="styles/app.css" rel="stylesheet" type="text/css">
	
</head>
<body>
  <div class="wrapper">
    
    <header>
      <h1>Voice-change-O-matic</h1>
    </header>

    <canvas class="visualizer" width="640" height="100"></canvas> 

    <form class="controls">
      <div>
        <label for="voice">Voice setting</label>
        <select id="voice" name="voice">
          <option value="distortion">Distortion</option>
          <option value="convolver">Reverb</option>
          <option value="biquad">Bass Boost</option>
          <option value="off" selected>Off</option>
        </select>
      </div>
      <div>
        <label for="visual">Visualizer setting</label>
        <select id="visual" name="visual">
          <option value="sinewave">Sinewave</option>
          <option value="frequencybars" selected>Frequency bars</option>
          <option value="circle" selected>Circle</option>
          <option value="off">Off</option>
        </select>
      </div>
      <div>
        <a class="mute">Mute</a>
      </div>
    </form>


  </div>

  <label for="toggle">❔</label>
  <input type="checkbox" id="toggle">
  <aside>
    <h2>Information</h2>

    <p>Voice-change-O-matic is built using:</p>

    <ul>

    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Navigator.getUserMedia">getUserMedia</a>, which is currently supported in Firefox, Opera (desktop/mobile) and Chrome (desktop only.) Firefox requires no prefix; the others require <code>webkit</code> prefixes.</li>

    <li><a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web Audio API</a>, which is currently supported in Firefox, Chrome, Safari (desktop/mobile) and Opera (desktop only). Firefox and Opera require no prefix; Chrome requires <code>webkit</code> prefixes.</li>

    </ul>



    <button id="install-btn">Install app</button>
  </aside>

  <!-- The following element pulls in the script for the default template functionality -->
      
    <script src="scripts/install.js"></script>  

    <!-- Below is your custom application script -->

    <script src="scripts/app.js"></script>
	
</body>
</html>