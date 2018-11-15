class Matrix extends Collection {
    oneCell(row,col) {
        return this[row].scale(1/this[row][col]);
    }   
    zeroCell(row,col) {
        return this[row].add(this[row-1].scale(-1 * this[row][col]));
    }   
}