/**
 * Created by JacobJaffe on 11/6/17.
 */
class View
{
    Container: HTMLElement;
    Canvas: HTMLCanvasElement;
    Context: CanvasRenderingContext2D;

    constructor(containerId: string, canvasId: string) {
        this.Container = document.getElementById(containerId);
        this.Canvas = <HTMLCanvasElement>document.getElementById(canvasId);
        this.Context = this.Canvas.getContext("2d");
    }

    resize() : number {

        var old_r = this.Canvas.width > this.Canvas.height ? this.Canvas.height / 2 : this.Canvas.width / 2;

        this.Canvas.width = this.Container.clientWidth;
        this.Canvas.height = this.Container.clientHeight;

        var new_r = this.Canvas.width > this.Canvas.height ? this.Canvas.height / 2 : this.Canvas.width / 2;
        return  new_r / old_r;
    }
}

function View(canvasContainerId, canvasId) {
    this.canvasContainer = document.getElementById(canvasContainerId); // "canvas-container"
    this.canvas = document.getElementById(canvasId); // "myCanvas"
    this.context = this.canvas.

    this.shapes = [];
    this.isPlaying = false;
    this.speed = 1;
}

View.prototype.resize = functio() {

}