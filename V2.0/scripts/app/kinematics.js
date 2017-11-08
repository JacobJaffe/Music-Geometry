
// TODO: master speed should not be part of this via global
var Kinematics = (function () {
    function Kinematics(origin, pos, velocity, angularVelocity, angle) {
        this.origin = origin == null ? new Coords : origin;
        this.pos = pos == null ? new Coords() : pos;
        this.velocity = velocity == null ? new Velocity() : velocity;
        this.angularVelocity = angularVelocity == null ? 0 : angularVelocity;
        this.angle = angle == null ? 0 : angle;
    }
    Kinematics.prototype.move = function (masterSpeed) {
        this.pos = new Coords(this.pos.x + this.velocity.dx, this.pos.y + this.velocity.dy);
        this.angle  += 0.001 * this.angularVelocity * masterSpeed;
    };

    return Kinematics;
}());

