class StatsArray extends Collection {

    mean() {
        return this.average();
    }
    variance() {
        var mean = this.mean();
        var diffsSquared = this.map((o,i) => {
            var d = o - mean;
            return d*d;
        });
        var result = diffsSquared.average();
        return result;
    }
    standardDeviation() {
        return Math.sqrt(this.variance());
    }
    range() {
        return Math.max.apply(null,this) - Math.min.apply(null,this);
    }
}