
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
        this.pos = new Coords(this.pos.x + this.velocity.dx * masterSpeed, this.pos.y + this.velocity.dy * masterSpeed);
        this.angle  += 0.001 * this.angularVelocity * masterSpeed;
    };

    Kinematics.prototype.realPos = function() {
        return new Coords(this.origin.x + this.pos.x, this.origin.y + this.pos.y);
    };

    return Kinematics;
}());

