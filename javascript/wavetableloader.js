function WaveTableLoader() {

    this.waveNames = ['Celeste','Twelve String Guitar 1'];

    this.waveNamesV1 = [
        "01_Saw",
        "02_Triangle",
        "03_Square",
        "04_Noise",
        "05_Pulse",
        "06_Warm_Saw",
        "07_Warm_Triangle",
        "08_Warm_Square",
        "09_Dropped_Saw",
        "10_Dropped_Square",
        "11_TB303_Square",
        "Bass",
        "Bass_Amp360",
        "Bass_Fuzz",
        "Bass_Fuzz_ 2",
        "Bass_Sub_Dub",
        "Bass_Sub_Dub_2",
        "Brass",
        "Brit_Blues",
        "Brit_Blues_Driven",
        "Buzzy_1",
        "Buzzy_2",
        "Celeste",
        "Chorus_Strings",
        "Dissonant Piano",
        "Dissonant_1",
        "Dissonant_2",
        "Dyna_EP_Bright",
        "Dyna_EP_Med",
        "Ethnic_33",
        "Full_1",
        "Full_2",
        "Guitar_Fuzz",
        "Harsh",
        "Mkl_Hard",
        "Organ_2",
        "Organ_3",
        "Phoneme_ah",
        "Phoneme_bah",
        "Phoneme_ee",
        "Phoneme_o",
        "Phoneme_ooh",
        "Phoneme_pop_ahhhs",
        "Piano",
        "Putney_Wavering",
        "Throaty",
        "Trombone",
        "Twelve String Guitar 1",
        "Twelve_OpTines",
        "Wurlitzer",
        "Wurlitzer_2",
    ];
}

WaveTableLoader.prototype.load = function(finishedCallback) {
    var loader = this;

    loader.finishedCallback = finishedCallback;
    loader.loadedCount = 0;
    loader.waveList = new Array();

    console.log('checkit',loader);


    for (var i = 0; i < loader.waveNames.length; ++i) {
        var name = loader.waveNames[i];
        loader.waveList[i] = new WaveTable(name, context);
        loader.waveList[i].load(function(waveTable) {
            loader.loadedCount++;
            if (loader.loadedCount == loader.waveList.length)
                loader.finishedCallback();
        }
        );

    }
}

WaveTableLoader.prototype.makeWavePopup = function(popupName) {
    var waveList = document.getElementById(popupName);
        
    var numWaves = this.waveNames.length;
    
    for (var i = 0; i < numWaves; i++) {
        var item = document.createElement('option');
        item.innerHTML = this.waveNames[i];
                
        if (this.waveNames[i] == defaultWaveTableName)
            item.selected = "selected";

        waveList.appendChild(item);
    }
}

WaveTableLoader.prototype.getTable = function(name) {
    for (var i = 0; i < this.waveNames.length; ++i) {
        if (name == this.waveNames[i]) {
            return this.waveList[i];
        }
    }
}
