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
    // start trajectory in the center of the shape
    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    // move to the projection of the push

    // MINUS, because we want reverse
    context.lineTo(this.start.x - (-this.magnitude * Math.cos(this.angle)), this.start.y - (this.magnitude * Math.sin(this.angle)));

    // TODO: decide how we want to style the trajectory
    context.lineWidth = 5;
    context.strokeStyle = "black";
    context.stroke();
};

Trajectory.prototype.update = function(start, end) {
    this.start = start;
    this.end = end;
    this.magnitude = Coords.distance(this.start, this.end);
    this.angle = Coords.angle(this.start, this.end);
};