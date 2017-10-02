/**
 * Created by JacobJaffe on 4/13/17.
 */

function setupMouse() {
    console.log("Setting up mouse!");
    canvas.addEventListener("mousemove", mouseMove, false);
}

/* mouse Coordinates */
var mouseX;
var mouseY;

/* element that mouse is hovering over */
var hoverElem = null;

function mouseMove(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
    if (isHoveringCircle(mainPiano)) {
        document.body.style.cursor = "pointer";
        hoverElem = mainPiano;
    } else {
        hoverElem = null;
        document.body.style.cursor = "default";
    }
}


function isHoveringCircle(circle) {

}

function doMouseMove(event) {
    var mouseX = event.pageX;
    var mouseY = event.pageY;

    var canvas = layers[3].canvas;

    var w = canvas.width * 5 / 16;
    var h = (2 * (canvas.width / 4) / 5) - 5;

    var padding = canvas.width / 8;

    /* Join button */
    var x1 = padding;
    var y1 = canvas.height/ 4;

    /* Host button */
    var x2 = canvas.width - w - padding;
    var y2 = canvas.height/ 4;

    /* help button */
    var h3 = Math.floor(canvas.width / 15 - 5);
    var w3 = h3;
    var x3 = h3 / 2;
    var y3 = x3;

    isHoveringHost = false;
    isHoveringJoin = false;
    isHoveringHelp = false;

    /* rain comented out b/c now makes screen black not rain */

    if (mouseX >= x1 && mouseX <= x1 + w && mouseY >= y1 &&  mouseY <= y1 + h) {
        // if (!isHoveringJoin) {
        //     resetRain(layers[1]);
        // }
        isHoveringJoin = true;
    } else  if (mouseX >= x2 && mouseX <= x2 + w && mouseY >= y2 &&  mouseY <= y2 + h){
        // if (!isHoveringHost) {
        //     resetRain(layers[1]);
        // }
        isHoveringHost = true;
    } else if (mouseX >= x3 && mouseX <= x3 + w3 && mouseY >= y3 && mouseY <= y3 + h3) {
        isHoveringHelp = true;
    }

    if (isHoveringJoin || isHoveringHost || isHoveringHelp) {
        document.body.style.cursor = "pointer";
        layers[1].draw = draw_black_background;
    } else {
        document.body.style.cursor = "default";
        layers[1].draw = draw_white_background  ;
    }
}