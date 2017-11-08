/**
 * Created by JacobJaffe on 11/8/17.
 */

function Inputs(speedSliderId, pauseButtonId) {
    this.speedSlider = document.getElementById(speedSliderId); // "masterSpeedSlider"
    this.pauseButton = document.getElementById(pauseButtonId); // "togglePlaying"
    this.mouseX;
    this.mouseY;
    this.hoveredShape = null;
}

/* mouse Coordinates */

Inputs.prototype.onMouseMove = (event, shapes, offsetLeft, offsetTop) => {
    // what's this hard coded nonsense?!? or, more eloquently: TODO : figure out how to dynamically know where canvas starts
    this.mouseX = event.clientX - offsetLeft - 104;
    this.mouseY = event.clientY - offsetTop;

    // This code does too much in too little lines. the first line essentially get the hovered child.
    // The second checks the base case that the OG parent isn't being hovered.
    for (var shape of shapes) {
        this.hoveredShape = shape.hover(this.mouseX, this.mouseY);
        this.hoveredShape = shape.isBeingHovered ? shape : this.hoveredShape;
    }
};

Inputs.prototype.onMouseDown = () =>
{
    console.log(this.hoveredShape);
};