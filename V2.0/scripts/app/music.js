define(["./pianoCircle", "./coords", "./velocity", "./kinematics", "./pianoSegment", "./controller"], function () {
    return {
        setup: setup
    };
});

var MASTER_CONTROLLER;

function setup() {
    MASTER_CONTROLLER = new Controller("masterSpeedSlider", "togglePlaying", "canvas-container", "myCanvas");
    MASTER_CONTROLLER.CreateMasterCircle();
    // setupMusic();
    // setupControls();
    MASTER_CONTROLLER.Start();
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
