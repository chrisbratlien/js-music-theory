const UP = 1
const DOWN = -1
const NOT_FOUND = -2;
const NO_CURRENT = -3;

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

function ConnectingGame({noteBounds, direction = UP }) {    
    const [low,high] = noteBounds;
    let noteRange = range(high - low + 1,60); //upper deck
    let currentIdx = NO_CURRENT; 
    let currentDirection = direction;

    //abstract/chromatic 12-tones on or off. C..B 0..11
    let enabled = [0,0,0,0,0,0,0,0,0,0,0,0];

    //next note Range index in direction that is enabled
    function advance(dir = UP) {
        for (var i = currentIdx; i < noteRange.length && i >= 0; i += dir) {
            if (i !== currentIdx && enabled[noteRange[i]%12]) { 
                return i;
            }
        }
        return NOT_FOUND;
    }

    function nextValidIndex() {
        if (currentIdx == NO_CURRENT) { return 0; }
        let candidate = advance(currentDirection);
        if (candidate == NOT_FOUND) {
            currentDirection *= -1; //switch directions
            candidate = advance(currentDirection);        
        }
        return candidate;
    }

    function currentNoteNumber() {
        return noteRange[currentIdx];
    }
    function tick() {
        currentIdx = nextValidIndex();
        return currentNoteNumber();
    }

    function enableNoteValues(arrayOfNoteValues, clearExisting = true) {
        if (clearExisting) {
            clearEnabled();
        }
        arrayOfNoteValues.forEach(nv => { enabled[nv%12] = 1; })
        return enabled;
    }
    function clearEnabled() {
        enabled = enabled.map(n => 0);
    }
    function test() {
        let g = new ConnectingGame({
            noteBounds: [60,71],
            direction: DOWN,
        });    
        g.enableNoteValues([60,64,67,70])
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('update...', g.enableNoteValues([60,63,67,70]))
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        console.log('now playing',g.tick())
        


    }

    return {
        enabled,
        enableNoteValues,
        test,
        tick
    }
}

export default ConnectingGame;