/**
 * Created by JacobJaffe on 12/19/17.
 */

function Trajectory() {
    this.start = new Coords();
    this.end = new Coords();
    this.magnitude = 0;
    this.angle = 0;
    this.color = "black";
}

Trajectory.prototype.draw = function(context) {
    if (this.start.x == this.end.x && this.start.y == this.end.y) {
        return;
    }

    var to = new Coords(this.start.x - (-this.magnitude * Math.cos(this.angle)), this.start.y - (this.magnitude * Math.sin(this.angle)));

    drawArrow(this.start, to, context, "black", "none")
};

Trajectory.prototype.update = function(start, end) {
    this.start = start;
    this.end = end;
    this.magnitude = Coords.distance(this.start, this.end);
    this.angle = Coords.angle(this.start, this.end);
};