class Vector extends Array {
    scale(r) {
        return this.map(o => r*o);
    }
}