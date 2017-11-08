

define(["./shapes/pianoCircle", "./physics/coords", "./physics/velocity", "./physics/kinematics", "./shapes/pianoSegment", "./controller", "./inputs/inputs", "./inputs/mouse_and_keyboard"], function () {
    return {
        setup: setup
    };
});

var MASTER_CONTROLLER;

function setup() {
    MASTER_CONTROLLER = new Controller("masterSpeedSlider", "togglePlaying", "canvas-container", "myCanvas");
    MASTER_CONTROLLER.CreateMasterCircle();
    // setupMusic();
    MASTER_CONTROLLER.Start();
}
