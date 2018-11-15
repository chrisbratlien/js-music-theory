class Vector extends Array {
    static debug_sum(...them) {
        //var result = new Vector(Array(them.length).fill(0));
        console.log('them?',them);
        var result = them.reduce( (accum,current) => { 
            console.log('accum?',accum);
            return accum.add(current)


        });
        return result;
    }

    static sum(...vectors) {
        return vectors.reduce( (accum,current) => accum.add(current) );
    }

    scale(r) {
        return this.map(o => r*o);
    }
    add(v) {
        return this.map((o,i) => o + v[i])
    }
}