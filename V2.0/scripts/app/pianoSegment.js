/**
 * Created by JacobJaffe on 11/6/17.
 */
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