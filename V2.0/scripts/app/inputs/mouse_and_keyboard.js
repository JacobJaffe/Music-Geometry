/**
 * Created by JacobJaffe on 11/8/17.
 */

/* KEY BINDINGS: */
/* Spacebar */
var key_togglePlaying = 32;

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

/* a listener for the slider user input */
function masterSpeedSlider(speed) {
    MASTER_CONTROLLER.speed = speed;
}

/* moves master speed slider to indicated speed */
function moveMasterSpeedSlider(speed) {
    var masterSpeedSlider = document.getElementById("masterSpeedSlider");
    masterSpeedSlider.value = speed;
}

function togglePlaying() {
    MASTER_CONTROLLER.TogglePlaying();
}
