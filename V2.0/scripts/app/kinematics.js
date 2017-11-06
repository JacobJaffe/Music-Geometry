/**
 * Created by JacobJaffe on 11/6/17.
 */

function Kinematics(origin, pos, velocity, angularVelocity, angle) {
    this.Origin = origin;
    this.Pos = pos;
    this.Velocity = velocity;
    this.AngularVelocity = angularVelocity == null ? 0 : angularVelocity;
    this.Angle = angle == null ? 0 : angle;
}

Kinematics.prototype.Move = function () {
    this.Pos = { x: this.Pos.x + this.Velocity.dx, y: this.Pos.y + this.Velocity.dy };
};
