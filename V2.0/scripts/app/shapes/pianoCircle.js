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
    this.isHovered = false;
    this.isSelected = false;
    this.isPaused = false;
    this.id = generateRandomId(8);

    // TODO : STyLE
    this.activeColor = "blue";
    this.deactiveColor_primary = "white";
    this.deactiveColor_secondary = "black";

    /* TODO: make own function */
    for (var i = 0; i < numSegments; i++) {
        var deactiveColor;
        i % 2 ? deactiveColor = "white" : deactiveColor = "black";
        var width = 360 / numSegments;
        var depth = radius / 30;
        this.Segments.push(new pianoSegment(width, depth));
    }
}

PianoCircle.prototype.draw = function(context) {

    // set the style in order of priority
    // default
    this.deactiveColor_primary = "white";
    this.deactiveColor_secondary = "black";

    // hovered
    if (this.isHovered) {
        this.deactiveColor_primary = "grey";
        this.deactiveColor_secondary = "black";
    }

    // selected
    if (this.isSelected) {
        this.deactiveColor_primary = "red";
    }

    this.drawSegments(context);
    this.drawChildren(context);
};

PianoCircle.prototype.drawSegments = function(context) {
    let x = this.kinematics.origin.x + this.kinematics.pos.x;
    let y = this.kinematics.origin.y + this.kinematics.pos.y;
    let radius = this.r;

    for (var index in this.Segments) {
        var activeColor = this.activeColor;
        var deactiveColor = index % 2 ? this.deactiveColor_primary : this.deactiveColor_secondary;
        var angle = this.kinematics.angle + 2 * index * Math.PI / this.Segments.length;
        this.Segments[index].draw(activeColor, deactiveColor, x, y, radius, angle, context);
    }
};

PianoCircle.prototype.drawChildren = function(context) {
    for (var child of this.children) {
        child.draw(context);
    }
};

PianoCircle.prototype.move = function(masterSpeed) {
    if (!this.isPaused) {
        this.kinematics.move(masterSpeed);
    }
    this.moveChildren(masterSpeed);
};

PianoCircle.prototype.moveChildren = function(masterSpeed) {
    for (var child of this.children){
        if (collidesWithEdge(this, child)) {
            handleCollision(this, child);
        }

        /* adjust relative center */
        child.kinematics.origin.x = this.kinematics.origin.x + this.kinematics.pos.x;
        child.kinematics.origin.y = this.kinematics.origin.y + this.kinematics.pos.y;

        child.move(masterSpeed);
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
};

PianoCircle.prototype.addChild = function(child) {
    child.kinematics.origin.x = this.kinematics.origin.x + this.kinematics.pos.x;
    child.kinematics.origin.y = this.kinematics.origin.y + this.kinematics.pos.y;
    this.children.push(child);
};


PianoCircle.prototype.reCenter = function(new_origin) {
    this.kinematics.origin = new_origin;
    //this.reCenterChildren();
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
    for (var segment of this.Segments) {
        segment.depth = segment.depth * scale;
    }

    for (var child of this.children) {
        child.reSize(scale);
    }
};


//TODO: this is a really janky way to get the hovered element back. its 5.08 am this is not good code :(
// a shape is being hovered IFF it is being hovered and its children are not.
PianoCircle.prototype.checkHovered = function(coords) {

    // shift perspective to origin
    let shifted_x = coords.x - this.kinematics.origin.x - this.kinematics.pos.x;
    let shifted_y = coords.y - this.kinematics.origin.y - this.kinematics.pos.y;
    let distanceFromOirgin = Math.sqrt(shifted_x ** 2 + shifted_y ** 2);
    return (distanceFromOirgin < this.r);
};

PianoCircle.prototype.toggleHovered = function(overide) {
    if (overide == null || overide != this.isHovered) {
        this.isHovered = !this.isHovered;
    }
};

PianoCircle.prototype.togglePaused = function(overide) {
    if (overide == null || overide != this.isPaused) {
        this.isPaused = !this.isPaused;
    }
};

PianoCircle.prototype.toggleSelected = function(overide) {
    if (overide == null || overide != this.isSelected) {
        this.isSelected = !this.isSelected;
    }
};

PianoCircle.prototype.getCenter = function() {
    return this.Kinematics.realPos();
};

PianoCircle.prototype.traject = function(trajectory) {
  this.kinematics.velocity = new Velocity(trajectory.magnitude * Math.cos(trajectory.angle) / 10, -trajectory.magnitude * Math.sin(trajectory.angle) / 10);
};