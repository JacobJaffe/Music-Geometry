/*************************************
 ABSTRACTION BARRIER: Initilizers + Global State
 **************************************/


define(["./pianoCircle", "./coords"], function () {
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
    center_origin = new Coords(canvas.width / 2, canvas.height / 2);
    mainPiano = new PianoCircle(center_origin, 0, 0, 0, 0, containerR, 8,
        function() {  }, 4   );

    /* TODO: determine mainPiano function on key press */
   recursiveChildren(3, mainPiano);

}

function recursiveChildren(numRecursive, piano) {
    var currentPiano = piano;
    var MAX = 3;
    var MIN = -3;
    for (var i = 0; i < numRecursive; i++) {
        var child = new PianoCircle(new Coords(), 0, 0, Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN,
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
