/**
 * Created by JacobJaffe on 11/6/17.
 */
var Coords = (function () {
    // TODO: this might not be the best way to have a default constructor for 0, 0
    function Coords(x, y) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
    }
    return Coords;
}());
