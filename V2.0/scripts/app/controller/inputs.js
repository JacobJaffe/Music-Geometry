/**
 * Created by JacobJaffe on 11/8/17.
 */

function Inputs(speedSliderId, pauseButtonId) {
    this.speedSlider = document.getElementById(speedSliderId); // "masterSpeedSlider"
    this.pauseButton = document.getElementById(pauseButtonId); // "togglePlaying"

    this.mouseCoords;
    this.hoveredShape = null;
    this.selectedShape = null;
    this.isMouseDown = false;
};

/* mouse Coordinates */
function recursiveFindHoveredShape(shape, coords) {
    var hoveredShape = null;
    if (shape.checkHovered(coords)) {
        for (var child of shape.children) {
            hoveredShape = recursiveFindHoveredShape(child, coords);

            // a child is being hovered
            if (hoveredShape != null) {
                return hoveredShape;
            }
        }

        // no children are being hovered
        return shape;
    }

    // shape is not being hovered
    return null;
};


/**
 * Created by JacobJaffe on 11/8/17.
 */

/* KEY BINDINGS: */
/* Spacebar */
var key_togglePlaying = 32;

function keyboardPress(e) {
    var keyCode = e.keyCode;
    /* space  TODO: add a case statement for various keys */


    // pause the entire thing, unless a shape is selected
    if (keyCode == key_togglePlaying) {
        if (MASTER_CONTROLLER.Inputs.selectedShape == null) {
            MASTER_CONTROLLER.TogglePlaying();
        } else {
            MASTER_CONTROLLER.PauseSelectedShape();
        }
    }
}

/* a listener for the slider user input */
function MASTER_SPEED_SLIDER(speed) {
    MASTER_CONTROLLER.speed = speed;
}

function PLAY_BUTTON() {
    MASTER_CONTROLLER.TogglePlaying();
}

function SELECTED_SHAPE_RADIUS_SLIDER(slider) {
    if (MASTER_CONTROLLER.Inputs.selectedShape == null) {
        console.error("No selected shape to resize");
    } else {
        MASTER_CONTROLLER.Inputs.selectedShape.reSize(slider) ;
    }
}

function SELECTED_SHAPE_PAUSE_BUTTON() {
    MASTER_CONTROLLER.PauseSelectedShape();
}

function MOUSE_MOVE(event) {
    // what's this hard coded nonsense?!? or, more eloquently: TODO : figure out how to dynamically know where canvas starts
    MASTER_CONTROLLER.Inputs.mouseCoords =  new Coords(event.clientX - MASTER_CONTROLLER.View.canvas.offsetLeft - 104, event.clientY - MASTER_CONTROLLER.View.canvas.offsetTop);

    // This abuses that we can access the shapes' children, but its straightforward. TODO: don't do this badly!
    // Also, this probably won't work great for more than one master shape. But we don't really want to have more than 1...?
    for (var shape of MASTER_CONTROLLER.shapes) {

        // 1) if previously had a hovered shape, toggle it
        if (MASTER_CONTROLLER.Inputs.hoveredShape != null) {
            MASTER_CONTROLLER.Inputs.hoveredShape.toggleHovered();
        }

        // 2) compute new hovered shape
        MASTER_CONTROLLER.Inputs.hoveredShape = recursiveFindHoveredShape(shape, MASTER_CONTROLLER.Inputs.mouseCoords);

        // 3) if now has a hovered shape, toggle it
        // NOTE: if the hovered shape remains the same, then nothing should happen, as this inverses step 1)
        if (MASTER_CONTROLLER.Inputs.hoveredShape != null) {
            MASTER_CONTROLLER.Inputs.hoveredShape.toggleHovered();
        }
    }

    if (MASTER_CONTROLLER.Inputs.hoveredShape != null) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }

    if (MASTER_CONTROLLER.Inputs.isMouseDown) {
        console.log("mouse down and moving");
        if (MASTER_CONTROLLER.Inputs.selectedShape != null ) {
            MASTER_CONTROLLER.trajectory.update(MASTER_CONTROLLER.Inputs.selectedShape.kinematics.realPos(), MASTER_CONTROLLER.Inputs.mouseCoords);
        }
    };
};

function MOUSE_DOWN(event) {
    MASTER_CONTROLLER.Inputs.isMouseDown = true;


    // SELECT HOVERED SHAPE
    // 1) if previously had a Selected shape, toggle it
    if (MASTER_CONTROLLER.Inputs.selectedShape != null) {
        MASTER_CONTROLLER.Inputs.selectedShape.toggleSelected();
    }

    // 2) compute new selected shape, from current hovered
    MASTER_CONTROLLER.Inputs.selectedShape = MASTER_CONTROLLER.Inputs.hoveredShape;

    // 3) if now has a hovered shape, toggle it
    // NOTE: if the hovered shape remains the same, then nothing should happen, as this inverses step 1)
    if (MASTER_CONTROLLER.Inputs.selectedShape != null) {
        MASTER_CONTROLLER.Inputs.selectedShape.toggleSelected();
    }
    console.log("down");
}

function MOUSE_UP(event) {
    MASTER_CONTROLLER.Inputs.isMouseDown = false;

    // null check on trajectory else the shapes will have uncaught issues with the physics
    if (MASTER_CONTROLLER.Inputs.selectedShape != null && MASTER_CONTROLLER.trajectory != null) {
        MASTER_CONTROLLER.Inputs.selectedShape.traject(MASTER_CONTROLLER.trajectory);
    }
    MASTER_CONTROLLER.trajectory.update(0, 0);
    console.log("up");
}