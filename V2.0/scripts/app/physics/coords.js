/**
 * Created by JacobJaffe on 11/6/17.
 */
var Coords = function(x, y){
    this.x = x == null ? 0 : x;
    this.y = y == null ? 0 : y;
};

Coords.random = function (rangeX, rangeY) {
    return new Coords(Math.random() * rangeX, Math.random() * rangeY);
};

Coords.distance = function (coord1, coord2) {

    let x_dif = coord1 > coord2 ? (coord1.x - coord2.x) : coord2.x - coord1.x;
    let y_dif = coord1 > coord2 ? (coord1.y - coord2.y) : coord2.y - coord1.y;

    return Math.sqrt(
        (x_dif ** 2) +
        (y_dif ** 2)
    )
};

Coords.angle = function (coord1, coord2) {
    return (Math.atan2(coord1.x-coord2.x, coord1.y-coord2.y)) - Math.PI / 2;
};