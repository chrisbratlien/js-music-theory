var timestamp = Date.now();

module.exports = {
  prodJs: 'javascript/build/app' + timestamp + '.js',
  prodCss: 'styles/build/app' + timestamp + '.css',

  css: [
    'styles/src/ero.css',
    'styles/src/tti.widgets.css',
    'styles/src/side-panel.css',
    'styles/src/last-media-queries.css'
  ],

  libraries: [
    'javascript/includes/jquery-ui/js/jquery-1.7.2.min.js',
    'javascript/includes/jquery-ui/js/jquery-ui-1.8.20.custom.min.js'
  ],

  js: [
    'javascript/src/array.js',
    'javascript/src/eachify.js',
    'javascript/src/csvjson.js',
    'javascript/src/string.supplant.js',
    'javascript/src/dom.js',
    'javascript/src/color.js',
    'javascript/src/pairs.js',
    'javascript/src/jquery.scrollTo.js',
    'javascript/src/common.js',
    'javascript/src/tti.pubsub.js',
    'javascript/src/tti.point.js',
    'javascript/src/tti.detours.js',
    'javascript/src/tti.stretches.js',
    'javascript/src/tti.incident.js',
    ///'javascript/src/tti.mstrafficincident.js',
    'javascript/src/tti.laneclosure.js',
    'javascript/src/tti.pcmssites.js',
    'javascript/src/tti.cctvsites.js',
    'javascript/src/tti.latlongmile.js',
    'javascript/src/tti.routesummary.js',
    'javascript/src/tti.gurus.bingmaps7.js',
    'javascript/src/tti.gurus.googlemaps.js',
    'javascript/src/tti.eoqhelper.js',
    'javascript/src/tti.widgets.dropdownfield.js',
    'javascript/src/tti.widgets.procrastinator.js',
    'javascript/src/tti.widgets.basictogglelayerspanel.js',
    'javascript/src/tti.widgets.presentation.js',
    'javascript/src/tti.widgets.checkbox.js',
    'javascript/src/tti.widgets.js',
    'javascript/src/tti.storage.js',
    'javascript/src/tti.widgets.lightbox.js',
    'javascript/src/tti.widgets.weather.js',
    'javascript/src/tti.widgets.stickyheaders.js',
    'javascript/src/bootup.js'
  ]
};
