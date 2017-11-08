/**
 * Created by JacobJaffe on 11/6/17.
 */
function View(canvasContainerId, canvasId) {
    this.canvasContainer = document.getElementById(canvasContainerId); // "canvas-container"
    this.canvas = document.getElementById(canvasId); // "myCanvas"
    this.context = this.canvas.getContext("2d");
    this.canvasContainerRadius = (this.canvas.width > this.canvas.height ? this.canvas.height / 2 : this.canvas.width / 2) - 10;
};

View.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

View.prototype.getCenter = function () {
    return new Coords(this.canvas.width / 2, this.canvas.height / 2);
};

View.prototype.resizeCanvas = function () {
    this.canvas.width = this.canvasContainer.clientWidth;
    this.canvas.height = this.canvasContainer.clientHeight;
    this.canvasContainerRadius = (this.canvas.width > this.canvas.height ? this.canvas.height / 2 : this.canvas.width / 2) - 10;
};