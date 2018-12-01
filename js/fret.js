class Fret {

    constructor(spec) {
        this.spec = spec;
    }
    distanceSquaredTo(other) {
        let x1 = this.spec.fret,
            y1 = this.spec.string,
            x2 = other.spec.fret,
            y2 = other.spec.string;
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx*dx + dy*dy;
    }
    distanceTo(other) {
        return Math.sqrt(this.distanceSquaredTo(other));
    }
    fretDistanceTo(other) {
        let x1 = this.spec.fret,
            x2 = other.spec.fret;
        var dx = x2 - x1;
        return dx;
    }
    stringDistanceTo(other) {
        let y1 = this.spec.string,
            y2 = other.spec.string;
        var dy = y2 - y1;
        return dy;
    }
    midpointTo(other) {
        return new Fret({
            fret: (this.spec.fret + other.spec.fret) / 2,
            string: (this.spec.string + other.spec.string) / 2
        });
    }


}