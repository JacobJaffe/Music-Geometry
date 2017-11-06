/*************************************
 ABSTRACTION BARRIER: Initilizers + Global State
 **************************************/


define(function () {
    return {
        setup: setup
    };
});

/* to toggle start / stop */
var playing = true;

/* speed of entire process, negatives can rewind. */
var masterSpeed = 1;

function togglePlaying() {
    playing = !playing;
    var text = document.getElementById("togglePlaying");
    if (playing == true) {
        text.innerHTML = "Pause";
        moveMasterSpeedSlider(masterSpeed);
        drawFrame();
    } else {
        text.innerHTML = "Play";
        moveMasterSpeedSlider(0);
    }
}

function setup() {
    setupMusic();
    setupGraphics();
    setupControls();
    drawFrame();
}

/*************************************
 ABSTRACTION BARRIER: GRAPHICS
 **************************************/

/* Global graphics rendering variables */

var canvasContainer; /* div container for the canvas */
var canvas;     /* HTML5 canvas to render/draw on */
var context;    /* canvas context property */

/* TODO: consider the even grander idea of this inside of a modal changing piano? */
var mainPinao;
var innerPiano;

/* initializes canvas, initializes animations */
function setupGraphics() {
    console.log("Setting up graphics!");
    canvasContainer = document.getElementById("canvas-container");
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");

    resizeCanvas();
    setupMainPiano();
}

/* resizes canvas to fit screen */
function resizeCanvas() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
}


/*************************************
    ABSTRACTION: PianoCircle 'Class'
 **************************************/


/* TODO: consider x, y, dx, dy, and other related movement variables as own object? */
/* TODO: have x, y, be relative ?!?!?!? */

function PianoCircle(originX, originY, x, y, dx, dy, radius, numSegments, keyFunction, rotationSpeed) {
    this.originX = originX;
    this.originY = originY;
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
    var x = this.originX + this.x;
    var y = this.originY + this.y;
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
        child.originX = this.originX + this.x;
        child.originY = this.originY + this.y;

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
    child.originX = this.originX + this.x;
    child.originY = this.originY + this.y;
    this.children.push(child);
};

/* used for when screen size changes */
PianoCircle.prototype.transformChildren = function() {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].originX = this.originX + this.x;
        this.children[i].originY = this.originY + this.y;
        this.children[i].transformChildren();
    }
};

/*************************************
 ABSTRACTION BARRIER: END PianoCircle 'class'
 **************************************/

/*************************************
 ABSTRACTION BARRIER: START Segment 'class'
 **************************************/
function Segment(deactiveColor, width, depth) {
    this.deactiveColor = deactiveColor;
    this.width = width;
    this.depth = depth;
    this.activeColor = "blue";
    this.isActive = false;
}

Segment.prototype.draw = function(i, x, y, r, startAngle) {
    context.beginPath();
    context.arc(x, y, r,
        (startAngle + this.width * i * Math.PI / 180),
        (startAngle + this.width * (i + 1) * Math.PI / 180), false);

    if (this.isActive) {
        context.lineWidth = this.depth * 2;
        context.strokeStyle = this.activeColor;
    } else {
        context.lineWidth = this.depth;
        context.strokeStyle = this.deactiveColor;
    }

    context.stroke();
};

/*************************************
 ABSTRACTION BARRIER: Start Segment 'class'
 **************************************/


/* draw a single frame of animation, call animation loop */
function drawFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height); /* clears previous frame */
    resizeCanvas();
    transformMainPiano();
    mainPiano.updateLocation();
    mainPiano.draw();

    if (playing) {
        requestAnimationFrame(drawFrame);
    }

}

/* Containing Piano of keys, as in A Major, B Minor.
TODO: change names around so 'key' does not have multiple meanings
 */

/* sets up the main, largest & containing, Piano on screen */
function setupMainPiano() {
    /* to make the largest circle possible within the canavs */
    var containerR = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    mainPiano = new PianoCircle(canvas.width / 2, canvas.height / 2, 0, 0, 0, 0, containerR, 8,
        function() {  }, 4   );

    /* TODO: determine mainPiano function on key press */
   recursiveChildren(3, mainPiano);

}

function recursiveChildren(numRecursive, piano) {
    var currentPiano = piano;
    var MAX = 3;
    var MIN = -3;
    for (var i = 0; i < numRecursive; i++) {
        var child = new PianoCircle(0, 0, 0, 0, Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN,
            piano.r / 1.5, 8, function() { }, 10);
        piano.addChild(child);
        piano = piano.children[0];
    }
}

/* for reajusting the containing piano's position and size. Children will be scaled within it. */
function transformMainPiano() {
    var containerR = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var scale = (containerR - 5) / mainPiano.r;
    /* TODO: consider potential issue here, where radius is same but origin changes? Probably dosn't matter because would be square? */
    if (scale != 1) {
        mainPiano.r = containerR - 5;
        /* TODO: find better way to make make it not spill out */
        mainPiano.originX = canvas.width / 2;
        mainPiano.originY = canvas.height / 2;
        mainPiano.segDepth = containerR / 30;
        /* TODO Make these own function? */
        /* TODO: transform children, think inductively, this is the base case */
        mainPiano.transformChildren();
    }
}

/*************************************
    ABSTRACTION BARRIER: AUDIO
**************************************/


function setupMusic() {
    console.log("Setting up music!");
}

/*************************************
 ABSTRACTION BARRIER: MOUSE + KEYBOARD
 **************************************/

/* KEY BINDINGS: */
/* Spacebar */
var key_togglePlaying = 32;

function setupControls() {
    setupMouse();
    setupKeyboard();
}

function setupMouse() {
    console.log("Setting up mouse!");
    canvas.addEventListener("mousemove", mouseMove, false);
}

/* mouse Coordinates */
var mouseX;
var mouseY;

function mouseMove(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
}

function setupKeyboard() {
    console.log("Setting up keyboard!");
    window.addEventListener('keypress', keyboardPress, false);
}

function keyboardPress(e) {
    var keyCode = e.keyCode;

    /* space  TODO: add a case statement for various keys */
    if (keyCode == key_togglePlaying) {
        togglePlaying();
    }
}

/* Sliders TODO: probably remove these, but they're nice for testing */
function masterSpeedSlider(speed) {
    masterSpeed = speed;
}

/* moves master speed slider to indicated speed */
function moveMasterSpeedSlider(speed) {
    var masterSpeedSlider = document.getElementById("masterSpeedSlider");
    masterSpeedSlider.value = speed;
}
