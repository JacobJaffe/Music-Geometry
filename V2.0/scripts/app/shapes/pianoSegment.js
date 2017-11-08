/**
 * Created by JacobJaffe on 11/6/17.
 */
function pianoSegment(width, depth) {
    this.width = width;
    this.depth = depth;
    this.isActive = false;
}

pianoSegment.prototype.draw = function(activeColor, deactiveColor, x, y, radius, angle, context) {
    context.beginPath();
    context.arc(x, y, radius, angle, angle + this.width * Math.PI / 180, false);

    if (this.isActive) {
        context.lineWidth = this.depth * 2;
        context.strokeStyle = activeColor;
    } else {
        context.lineWidth = this.depth;
        context.strokeStyle = deactiveColor;
    }

    context.stroke();
};