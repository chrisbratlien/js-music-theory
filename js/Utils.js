export function setBackgroundHue(elem, hueRads) {
    //elem.style.backgroundColor = `hsl(${hueRads}rad,50%,50%)`;

    elem.style.background = `linear-gradient(
            to bottom, 
            hsl(${hueRads}rad,50%,60%) 0%, 
            hsl(${hueRads}rad,50%,40%) 100%
        )`;

}


export function sorter(selectorFunc) {
    var sortFunc = function(a, b) {
        var sA = selectorFunc(a);
        var sB = selectorFunc(b);
        if (sA < sB) { return -1; }
        if (sA > sB) { return 1; }
        return 0;
    };
    return sortFunc;
};