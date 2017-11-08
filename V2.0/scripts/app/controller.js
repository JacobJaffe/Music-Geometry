/**
 * Created by JacobJaffe on 11/6/17.
 */

// TODO: use the view object also
function Controller(speedSliderId, pauseButtonId, canvasContainerId, canvasId) {
    this.Inputs = new Inputs(speedSliderId, pauseButtonId);
    this.canvasContainer = document.getElementById(canvasContainerId); // "canvas-container"
    this.canvas = document.getElementById(canvasId); // "myCanvas"
    this.context = this.canvas.getContext("2d");
    this.canvasContainerRadius = (this.canvas.width > this.canvas.height ? this.canvas.height / 2 : this.canvas.width / 2) - 10;
    this.canvas.addEventListener("mousemove", (event) => {this.Inputs.onMouseMove(event, this.shapes, this.canvas.offsetLeft, this.canvas.offsetTop)}, false);
    this.canvas.addEventListener("mousedown", (event) => {this.Inputs.onMouseDown()}, false);

    this.shapes = [];
    this.isPlaying = false;
    this.speed = 1;
}

Controller.prototype.AddShape = function(shape) {
  this.shapes.push(shape);
};

Controller.prototype.TogglePlaying = function(toggle) {
    this.isPlaying = toggle == null ? !this.isPlaying : toggle; // by default invert, can over-ride to set a state
    if (this.isPlaying) {
        this.Inputs.pauseButton.innerHTML = "Pause";
        moveMasterSpeedSlider(this.speed);
        this.drawFrame();
    } else {
        this.Inputs.pauseButton.innerHTML = "Play";
        moveMasterSpeedSlider(0);
    }
};

Controller.prototype.Start = function() {
    this.isPlaying = true;
    this.drawFrame();
};

/* draw a single frame of animation, call animation loop */
Controller.prototype.drawFrame = function() {
    var _this = this;
    this.resizeCanvas();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);


    var old_radius = this.canvasContainerRadius;
    this.canvasContainerRadius = (this.canvas.width > this.canvas.height ? this.canvas.height / 2 : this.canvas.width / 2) - 5;
    var scale = this.canvasContainerRadius / old_radius;

    for (var shape of this.shapes) {
        shape.reCenter(new Coords(this.canvas.width / 2, this.canvas.height / 2));
        shape.reSize(scale);
        shape.move(this.speed);
        shape.draw(this.context);
    }

    // recursively request frames while controller is active
    if (this.isPlaying) {
        requestAnimationFrame(function () {
            _this.drawFrame();
        });
    }
};

Controller.prototype.resizeCanvas = function () {
    this.canvas.width = this.canvasContainer.clientWidth;
    this.canvas.height = this.canvasContainer.clientHeight;
};

Controller.prototype.CreateMasterCircle = function () {
    var origin = new Coords(this.canvas.width / 2, this.canvas.height / 2);
    var pos = new Coords();
    var velocity = new Velocity();
    var kinematics = new Kinematics(origin, pos, velocity, 5, 0);
    var masterCircle = new PianoCircle(kinematics, this.canvasContainerRadius, 12, () => {});

    // Children of the master piano
    var MAX = 3;
    var MIN = -3;
    var angle = 0;
    var velocity = new Velocity(Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN);
    var kinematics = new Kinematics(new Coords(), new Coords(), velocity, 10, 0 );
    var child = new PianoCircle(kinematics, masterCircle.r / 1.5, 8, () => { });
    masterCircle.addChild(child);
    this.AddShape(masterCircle);
};