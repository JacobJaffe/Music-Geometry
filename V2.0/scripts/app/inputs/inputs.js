/**
 * Created by JacobJaffe on 11/8/17.
 */

function Inputs(speedSliderId, pauseButtonId) {
    this.speedSlider = document.getElementById(speedSliderId); // "masterSpeedSlider"
    this.pauseButton = document.getElementById(pauseButtonId); // "togglePlaying"
    this.mouseCoords;
    this.hoveredShape = null;
}

/* mouse Coordinates */

Inputs.prototype.onMouseMove = (event, shapes, offsetLeft, offsetTop) => {
    // what's this hard coded nonsense?!? or, more eloquently: TODO : figure out how to dynamically know where canvas starts
    this.mouseCoords =  new Coords(event.clientX - offsetLeft - 104, event.clientY - offsetTop);

    // This abuses that we can access the shapes' children, but its straightforward. TODO: don't do this badly!
    // Also, this probably won't work great for more than one master shape. But we don't really want to have more than 1...?
    for (var shape of shapes) {

        // 1) if previously had a hovered shape, toggle it
        if (this.hoveredShape != null) {
            this.hoveredShape.toggleHovered();
        }

        // 2) compute new hovered shape
        this.hoveredShape = recursiveFindHoveredShape(shape, this.mouseCoords);

        // 3) if now has a hovered shape, toggle it
        // NOTE: if the hovered shape remains the same, then nothing should happen, as this inverses step 1)
        if (this.hoveredShape != null) {
            this.hoveredShape.toggleHovered();
        }    }
};

Inputs.prototype.onMouseDown = () =>
{
    console.log(this.hoveredShape);
    this.hoveredShape.togglePaused();
};

function recursiveFindHoveredShape(shape, coords) {
    var hoveredShape = null;
    if (shape.checkHovered(coords)) {
        for (child of shape.children) {
            hoveredShape = recursiveFindHoveredShape(child, coords);

            // a child is being hovered
            if (hoveredShape != null) {
                return hoveredShape;
            }
        }

        // no children are being hovered
        return shape;
    }

    // shape is not beingh overed
    return null
};