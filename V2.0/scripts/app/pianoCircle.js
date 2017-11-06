/**
 * Created by JacobJaffe on 11/6/17.
 */
/* TODO: consider x, y, dx, dy, and other related movement variables as own object? */
/* TODO: have x, y, be relative ?!?!?!? */


function PianoCircle(origin, x, y, dx, dy, radius, numSegments, keyFunction, rotationSpeed) {
    this.origin = origin;
    this.x = x;    /* relative to origin */
    this.y = y;    /* relative to origin */
    this.dx = dx;   /* x-comp of velocity */
    this.dy = dy;   /* y-comp of velocity */
    this.r = radius;
    this.Segments = [];
    this.startAngle = 0;
    this.rotationSpeed = rotationSpeed;
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
    var x = this.origin.x + this.x;
    var y = this.origin.y + this.y;
    for (var i = 0; i < this.Segments.length; i++) {
        this.Segments[i].draw(i, x, y, this.r, this.startAngle);
    }

    /* rotate */
    this.startAngle += 0.001 * this.rotationSpeed * masterSpeed;
    this.drawChildren();
};

PianoCircle.prototype.drawChildren = function() {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].draw();
        this.children[i].drawChildren();
    }
};

PianoCircle.prototype.updateLocation = function() {
    this.x += this.dx * masterSpeed;
    this.y += this.dy * masterSpeed;
    this.updateChildrenLocations();
};

PianoCircle.prototype.updateChildrenLocations = function() {
    for (var i = 0; i < this.children.length; i++) {
        var child = this.children[i];

        /* adjust relative center */
        child.origin.x = this.origin.x + this.x;
        child.origin.y = this.origin.y + this.y;

        if (collidesWithEdge(this, child)) {
            handleCollision(this, child);
        }

        child.updateLocation();
        child.updateChildrenLocations();
    }
};

function collidesWithEdge(parent, child) {
    if (Math.sqrt(child.x * child.x + child.y * child.y) + child.r >= parent.r) {
        return true;
    }
}

/* handles key press and new motion */
function handleCollision(parent, child) {

    /* turn off old active key */
    parent.Segments[child.keyPress].isActive = false;

    var v = Math.sqrt(child.dx * child.dx + child.dy * child.dy);
    var AngleParentCenterToCollision = Math.atan2(-child.y, child.x);
    var AngleChildVelocity = Math.atan2(-child.dy, child.dx);
    var newAngle = 2 * AngleParentCenterToCollision - AngleChildVelocity;
    child.dx = -v * Math.cos(newAngle);
    child.dy = v * Math.sin(newAngle);

    child.keyPress = parent.keyAtAngle(AngleParentCenterToCollision);
    parent.Segments[child.keyPress].isActive = true;
}

/* returns the key at the angle */
PianoCircle.prototype.keyAtAngle = function(angle) {
    var numSegs = this.Segments.length;
    var rotatedAngle = (angle + this.startAngle) * 180 / Math.PI ;
    while (rotatedAngle < 0) {
        rotatedAngle += 360;
    }
    rotatedAngle = rotatedAngle % 360;
    var keyNum = numSegs - 1 - (rotatedAngle - rotatedAngle % (360/numSegs)) * numSegs / 360;
    return keyNum;
}

PianoCircle.prototype.addChild = function(child) {
    child.origin.x = this.origin.x + this.x;
    child.origin.y = this.origin.y + this.y;
    this.children.push(child);
};

/* used for when screen size changes */
PianoCircle.prototype.transformChildren = function() {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].origin.x = this.origin.x + this.x;
        this.children[i].origin.y = this.origin.y + this.y;
        this.children[i].transformChildren();
    }
};
