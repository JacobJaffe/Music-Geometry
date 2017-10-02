/**
 * Created by JacobJaffe on 9/22/17.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function init(containerId, canvasId) {
    // get the display
    var master_display = new View(containerId, canvasId);
    // resize it to fill its container
    master_display.resize();
    // create a controller for the program flow
    var master_controller = new Controller(master_display);
    var canvas = master_controller.Display.Canvas;
    // TODO: improve starting wheel
    var r = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var master_circle = new Circle("blue", { x: 0, y: 0 }, { dx: 0, dy: 0 }, 0, 0, 3, r);
    master_circle.Origin = { x: canvas.width / 2, y: canvas.height / 2 };
    master_circle.AddChild(new Ball("red", { x: 0, y: 0 }, { dx: 1, dy: 0 }, 0, 0, 1, r / 5));
    master_controller.addShape(master_circle);
    master_controller.togglePlaying();
}
var View = (function () {
    function View(containerId, canvasId) {
        this.Container = document.getElementById(containerId);
        this.Canvas = document.getElementById(canvasId);
        this.Context = this.Canvas.getContext("2d");
    }
    View.prototype.resize = function () {
        var old_r = this.Canvas.width > this.Canvas.height ? this.Canvas.height / 2 : this.Canvas.width / 2;
        this.Canvas.width = this.Container.clientWidth;
        this.Canvas.height = this.Container.clientHeight;
        var new_r = this.Canvas.width > this.Canvas.height ? this.Canvas.height / 2 : this.Canvas.width / 2;
        return new_r / old_r;
    };
    return View;
}());
var Controller = (function () {
    function Controller(display) {
        this.Display = display;
        this.Speed = 1;
        this.IsPlaying = false;
        this.Shapes = [];
    }
    Controller.prototype.addShape = function (new_shape) {
        this.Shapes.push(new_shape);
    };
    Controller.prototype.togglePlaying = function () {
        var _this = this;
        this.IsPlaying = !this.IsPlaying;
        if (this.IsPlaying) {
            requestAnimationFrame(function () {
                _this.drawFrame();
            });
        }
    };
    Controller.prototype.drawFrame = function () {
        var _this = this;
        this.Display.Context.clearRect(0, 0, this.Display.Canvas.width, this.Display.Canvas.height);
        var scale = this.Display.resize();
        for (var _i = 0, _a = this.Shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            // TODO: consider, for efficiency, having resetting of origin only occur if resize has occured
            shape.Kinematics.Origin = { x: this.Display.Canvas.width / 2, y: this.Display.Canvas.height / 2 };
            shape.Resize(scale);
            shape.Move();
            shape.Draw(this.Display.Context);
        }
        // recursively request frames while controller is active
        if (this.IsPlaying) {
            requestAnimationFrame(function () {
                _this.drawFrame();
            });
        }
    };
    return Controller;
}());
// TODO: own file
/**
 * Created by JacobJaffe on 9/24/17.
 */
//namespace Shapes {
var Shape = (function () {
    function Shape(kinematics, style) {
        this.Kinematics = kinematics;
        this.Children = [];
        this.Style = style;
    }
    ;
    // computes next frame
    Shape.prototype.Draw = function (context) {
        this.DrawSelf(context);
        this.DrawChildren(context);
    };
    Shape.prototype.DrawChildren = function (context) {
        for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.Kinematics.Origin = { x: this.Kinematics.Origin.x + this.Kinematics.Pos.x, y: this.Kinematics.Origin.y + this.Kinematics.Pos.y };
            // TODO: MAKE GENERIC
            if (this.isChildColliding(child)) {
                var v = Math.sqrt(child.Kinematics.Velocity.dx * child.Kinematics.Velocity.dx + child.Kinematics.Velocity.dy * child.Kinematics.Velocity.dy);
                var AngleParentCenterToCollision = Math.atan2(-child.Kinematics.Pos.y, child.Kinematics.Pos.x);
                var AngleChildVelocity = Math.atan2(-child.Kinematics.Velocity.dy, child.Kinematics.Velocity.dx);
                var newAngle = 2 * AngleParentCenterToCollision - AngleChildVelocity;
                child.Kinematics.Velocity.dx = -v * Math.cos(newAngle);
                child.Kinematics.Velocity.dy = v * Math.sin(newAngle);
            }
            child.Draw(context);
        }
    };
    Shape.prototype.Resize = function (scale) {
        this.ResizeSelf(scale);
        this.ResizeChildren(scale);
    };
    Shape.prototype.ResizeChildren = function (scale) {
        for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.Resize(scale);
        }
    };
    Shape.prototype.Move = function () {
        this.MoveSelf();
        this.MoveChildren();
    };
    Shape.prototype.MoveSelf = function () {
        this.Kinematics.Move();
    };
    Shape.prototype.MoveChildren = function () {
        for (var _i = 0, _a = this.Children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.Move();
        }
    };
    Shape.prototype.AddChild = function (shape) {
        this.Children.push(shape);
    };
    return Shape;
}());
//
// SHAPES:
//
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(center, velocity, rotationalSpeed, angle, style, radius) {
        _super.call(this, center, velocity, rotationalSpeed, angle, style);
        this.Radius = radius;
    }
    Circle.prototype.DrawSelf = function (context) {
        context.beginPath();
        var x = this.Pos.x + this.Origin.x;
        var y = this.Pos.y + this.Origin.y;
        context.arc(x, y, this.Radius, this.Angle, this.Angle + 2 * Math.PI);
        context.lineWidth = this.Stroke;
        context.strokeStyle = this.Color;
        context.stroke();
    };
    Circle.prototype.ResizeSelf = function (scale) {
        this.Radius = this.Radius * scale;
    };
    //TODO: MAKE GENERIC
    Circle.prototype.isChildColliding = function (child) {
        var circle_child = child;
        if (Math.sqrt(circle_child.Pos.x * circle_child.Pos.x + circle_child.Pos.y * circle_child.Pos.y) + circle_child.Radius >= this.Radius) {
            console.log("collision");
            return true;
        }
        return false;
    };
    return Circle;
}(Shape));
//}
var Coords = (function () {
    function Coords() {
    }
    return Coords;
}());
var Velocity = (function () {
    function Velocity() {
    }
    return Velocity;
}());
var Style = (function () {
    function Style() {
    }
    return Style;
}());
var Kinematics = (function () {
    function Kinematics() {
    }
    Kinematics.prototype.Move = function () {
        this.Pos = { x: this.Pos.x + this.Velocity.dx, y: this.Pos.y + this.Velocity.dy };
    };
    return Kinematics;
}());
