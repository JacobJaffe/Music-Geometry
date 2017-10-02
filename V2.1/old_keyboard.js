/**
 * Created by JacobJaffe on 4/13/17.
 */

/* KEY BINDINGS: */
/* Spacebar */
var key_togglePlaying = 32;

function setupControls() {
    setupMouse();
    setupKeyboard();
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
