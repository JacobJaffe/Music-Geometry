/**
 * Created by JacobJaffe on 11/6/17.
 */

// TODO: use the view object also
function Controller(speedSliderId, pauseButtonId, canvasContainerId, canvasId) {
    this.Inputs = new Inputs(speedSliderId, pauseButtonId);
    this.View = new View(canvasContainerId, canvasId);
    this.Audio = new Audio();

    this.View.canvas.addEventListener("mousemove", (event) => {MOUSE_MOVE(event)}, false);
    this.View.canvas.addEventListener("mousedown", (event) => {MOUSE_DOWN(event)}, false);
    this.View.canvas.addEventListener("mouseup", (event) => {MOUSE_UP(event)}, false);
    window.addEventListener('keypress', keyboardPress, false);

    this.shapes = [];
    this.trajectory = new Trajectory();
    this.HUD_elements = [];
    this.isPlaying = false;
    this.speed = 1;
};

Controller.prototype.TogglePlaying = function(toggle) {
    this.isPlaying = toggle == null ? !this.isPlaying : toggle; // by default invert, can over-ride to set a state
    if (this.isPlaying) {
        this.Inputs.pauseButton.innerHTML = "Pause";
        this.Inputs.speedSlider.value = (this.speed);
        this.drawFrame();
    } else {
        this.Inputs.pauseButton.innerHTML = "Play";
        this.Inputs.speedSlider.value = (0);
    }
};

Controller.prototype.Start = function() {
    this.isPlaying = true;
    this.drawFrame();
};

/* draw a single frame of animation, call animation loop */
Controller.prototype.drawFrame = function() {
    var _this = this;
    var old_radius = this.View.canvasContainerRadius;

    this.View.resizeCanvas();
    this.View.clear();

    var scale = this.View.canvasContainerRadius / old_radius;

    var speed = this.speed;
    if (this.Inputs.isMouseDown && this.Inputs.selectedShape != null) {
        speed = speed * 0.1;
    }

    for (var shape of this.shapes) {
        shape.reCenter(this.View.getCenter());
        shape.reSize(scale);
        shape.move(speed);
        shape.draw(this.View.context);
    }

    // todo: allow drawing of trajectories in more general cases
    if (this.Inputs.isMouseDown && this.Inputs.selectedShape != null && this.trajectory != null) {
        this.trajectory.draw(this.View.context);
    }

    // recursively request frames while controller is active
    if (this.isPlaying) {
        requestAnimationFrame(function () {
            _this.drawFrame();
        });
    }
};

Controller.prototype.PauseSelectedShape = function (overide) {
    if (this.Inputs.selectedShape == null) {
        console.error ("no selected shape");
    } else {
        this.Inputs.selectedShape.togglePaused(overide);
    }
};

/* shape editing */

Controller.prototype.AddShape = function(shape) {
    this.shapes.push(shape);
};

Controller.prototype.CreateMasterCircle = function () {
    var origin = this.View.getCenter();
    var pos = new Coords();
    var velocity = new Velocity();
    var kinematics = new Kinematics(origin, pos, velocity, 5, 0);
    var masterCircle = new PianoCircle(kinematics, this.View.canvasContainerRadius, 12, () => {});


    var keyFunction = () => {
        let sound = new Frequency(this.Audio.audioContext, this.Audio.masterGain, 369.994422711634398, "sine", 10);
        this.Audio.addSound(sound);
    };

    // NOTE: these origins get reset by addChild()
    // Children of the master piano
    var MAX = 3;
    var MIN = -3;
    var angle = 0;
    var velocity = new Velocity(Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN);
    var kinematics = new Kinematics(new Coords(), Coords.random(masterCircle.r, masterCircle.r), velocity, 10, 0 );
    var child1 = new PianoCircle(kinematics, masterCircle.r / 1.5, 8, keyFunction);


    // // Children of children of the master piano
    // var MAX = 3;
    // var MIN = -3;
    // var angle = 0;
    // var velocity = new Velocity(Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN);
    // var kinematics = new Kinematics(new Coords(), Coords.random(child1.r, child1.r), velocity, 10, 0 );
    // var child2 = new PianoCircle(kinematics, child1.r / 1.5, 8, () => { });
    //
    //
    // // Children of children of children of the master piano
    // var MAX = 3;
    // var MIN = -3;
    // var angle = 0;
    // var velocity = new Velocity(Math.random() * (MAX - MIN) + MIN, Math.random() * (MAX - MIN) + MIN);
    // var kinematics = new Kinematics(new Coords(), Coords.random(child2.r, child2.r), velocity, 10, 0 );
    // var child3 = new PianoCircle(kinematics, child2.r / 1.5, 8, () => { });
    //
    // child2.addChild(child3);
    // child1.addChild(child2);

    masterCircle.addChild(child1);
    this.AddShape(masterCircle);
};