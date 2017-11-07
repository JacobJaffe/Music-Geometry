/**
 * Created by JacobJaffe on 11/6/17.
 */
/* TODO: consider x, y, dx, dy, and other related movement variables as own object? */
/* TODO: have x, y, be relative ?!?!?!? */


function PianoCircle(kinematics, radius, numSegments, keyFunction) {
    this.kinematics = kinematics;
    this.r = radius;
    this.Segments = [];
    this.children = []; /* piano inception */
    this.balls = []; /* bouncing balls, probably just for lowest tier */
    this.keyPress = 0; /* key pressed in container */

    /* TODO: make own function */
    for (var i = 0; i < numSegments; i++) {
        var deactiveColor;
        i % 2 ? deactiveColor = "white" : deactiveColor = "black";
        var width = 360 / numSegments;
        var depth = radius / 30;
        this.Segments.push(new Segment(deactiveColor, width, depth));
    }
}

PianoCircle.prototype.draw = function() {
    var x = this.kinematics.origin.x + this.kinematics.pos.x;
    var y = this.kinematics.origin.y + this.kinematics.pos.y;
    for (var i = 0; i < this.Segments.length; i++) {
        this.Segments[i].draw(i, x, y, this.r, this.kinematics.angle);
    }
    this.drawChildren();
};

PianoCircle.prototype.drawChildren = function() {
    for (var child of this.children) {
        child.draw();
        child.drawChildren();
    }
};

PianoCircle.prototype.move = function() {
    this.kinematics.move();
    this.moveChildren();
};

PianoCircle.prototype.moveChildren = function() {
    for (var child of this.children){
        if (collidesWithEdge(this, child)) {
            handleCollision(this, child);
        }

        /* adjust relative center */
        child.kinematics.origin.x = this.kinematics.origin.x + this.kinematics.pos.x;
        child.kinematics.origin.y = this.kinematics.origin.y + this.kinematics.pos.y;

        child.move();
    }
};

function collidesWithEdge(parent, child) {
    if (Math.sqrt(child.kinematics.pos.x ** 2 + child.kinematics.pos.y ** 2) + child.r >= parent.r) {
        return true;
    }
}

/* handles key press and new motion */
function handleCollision(parent, child) {

    /* turn off old active key */
    parent.Segments[child.keyPress].isActive = false;

    var v = Math.sqrt(child.kinematics.velocity.dx ** 2 + child.kinematics.velocity.dy ** 2);
    var AngleParentCenterToCollision = Math.atan2(-child.kinematics.pos.y, child.kinematics.pos.x);
    var AngleChildVelocity = Math.atan2(-child.kinematics.velocity.dy, child.kinematics.velocity.dx);
    var newAngle = 2 * AngleParentCenterToCollision - AngleChildVelocity;
    child.kinematics.velocity.dx = -v * Math.cos(newAngle);
    child.kinematics.velocity.dy = v * Math.sin(newAngle);

    child.keyPress = parent.keyAtAngle(AngleParentCenterToCollision);
    parent.Segments[child.keyPress].isActive = true;
}

/* returns the key at the angle */
PianoCircle.prototype.keyAtAngle = function(angle) {
    var numSegs = this.Segments.length;
    var rotatedAngle = (angle + this.kinematics.angle) * 180 / Math.PI ;
    while (rotatedAngle < 0) {
        rotatedAngle += 360;
    }
    rotatedAngle = rotatedAngle % 360;
    var keyNum = numSegs - 1 - (rotatedAngle - rotatedAngle % (360/numSegs)) * numSegs / 360;
    return keyNum;
}

PianoCircle.prototype.addChild = function(child) {
    child.kinematics.origin.x = this.kinematics.origin.x + this.kinematics.pos.x;
    child.kinematics.origin.y = this.kinematics.origin.y + this.kinematics.pos.y;
    this.children.push(child);
};


PianoCircle.prototype.reCenter = function(new_origin) {
    this.kinematics.origin = new_origin;
    this.reCenterChildren();
};

PianoCircle.prototype.reCenterChildren = function() {
    for (var child of this.children) {
        child.kinematics.origin.x = this.kinematics.origin.x + this.kinematics.pos.x;
        child.kinematics.origin.y = this.kinematics.origin.y + this.kinematics.pos.y;
        child.reCenterChildren();
    }
};


PianoCircle.prototype.reSize = function(scale) {
    this.r = this.r * scale;

    for (var child of this.children) {
        child.reSize(scale);
    }
};