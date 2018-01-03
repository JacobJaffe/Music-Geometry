/**
 * Created by JacobJaffe on 12/21/17.
 */

// https://stackoverflow.com/questions/808826/draw-arrow-on-canvas-tag

function drawArrow(from, to, context, strokeColor, fillColor){

    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(to.y-from.y,to.x-from.x);

    //starting path of the arrow from the start square to the end square and drawing the stroke
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.strokeStyle = strokeColor;
    context.lineWidth = 22;
    context.stroke();

    //starting a new path from the head of the arrow to one of the sides of the point
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x-headlen*Math.cos(angle-Math.PI/7), to.y-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    context.lineTo(to.x-headlen*Math.cos(angle+Math.PI/7), to.y-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then again to the opposite side point
    context.lineTo(to.x, to.y);
    context.lineTo(to.x-headlen*Math.cos(angle-Math.PI/7), to.y-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    context.strokeStyle = strokeColor;
    context.lineWidth = 22;
    context.stroke();
    context.fillStyle = fillColor;
    context.fill();
}