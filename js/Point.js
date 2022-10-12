export function Point(x,y) {
    var self = { x, y };
    self.lessThan = function(aPoint) {
        return self.x < aPoint.x && self.y < aPoint.y;
    }
    self.max = function(aPoint) {
        return {
            x: Math.max(self.x, aPoint.x),
            y: Math.max(self.y, aPoint.y)
        }
    }
    self.min = function(aPoint) {
        return {
            x: Math.min(self.x, aPoint.x),
            y: Math.min(self.y, aPoint.y)
        }
    }
    return self;
}

export default Point;