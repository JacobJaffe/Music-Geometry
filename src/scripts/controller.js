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
    var master_circle_radius = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var master_circle_style = new Style(5, "blue", null);
    var master_circle_kinematics = new Kinematics({ x: canvas.width / 2, y: canvas.height / 2 }, new Coords(), new Velocity());
    var master_circle = new Circle(master_circle_kinematics, master_circle_style, master_circle_radius);
    var ball_radius = master_circle_radius / 5;
    var ball_style = new Style(1, "red", "red");
    var ball_kinematics = new Kinematics(master_circle.Kinematics.Pos, new Coords(randomIntFromInterval(-master_circle_radius / 2, master_circle_radius / 2), randomIntFromInterval(-master_circle_radius / 2, master_circle_radius / 2)), new Velocity(randomIntFromInterval(-10, 10), randomIntFromInterval(-10, 10)));
    var ball = new Circle(ball_kinematics, ball_style, ball_radius);
    master_circle.AddChild(ball);
    master_controller.AddShape(master_circle);
    master_controller.TogglePlaying();
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
    Controller.prototype.AddShape = function (new_shape) {
        this.Shapes.push(new_shape);
    };
    Controller.prototype.TogglePlaying = function () {
        var _this = this;
        this.IsPlaying = !this.IsPlaying;
        if (this.IsPlaying) {
            requestAnimationFrame(function () {
                _this.DrawFrame();
            });
        }
    };
    Controller.prototype.DrawFrame = function () {
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
                _this.DrawFrame();
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
    function Circle(kinematics, style, radius) {
        _super.call(this, kinematics, style);
        this.Radius = radius;
    }
    Circle.prototype.DrawSelf = function (context) {
        context.beginPath();
        var x = this.Kinematics.Pos.x + this.Kinematics.Origin.x;
        var y = this.Kinematics.Pos.y + this.Kinematics.Origin.y;
        context.arc(x, y, this.Radius, this.Kinematics.Angle, this.Kinematics.Angle + 2 * Math.PI);
        this.Style.Draw(context);
    };
    Circle.prototype.ResizeSelf = function (scale) {
        this.Radius = this.Radius * scale;
    };
    //TODO: MAKE GENERIC
    Circle.prototype.isChildColliding = function (child) {
        var circle_child = child;
        if (Math.sqrt(circle_child.Kinematics.Pos.x * circle_child.Kinematics.Pos.x + circle_child.Kinematics.Pos.y * circle_child.Kinematics.Pos.y) + circle_child.Radius >= this.Radius) {
            return true;
        }
        return false;
    };
    return Circle;
}(Shape));
//}
var Coords = (function () {
    // TODO: this might not be the best way to have a default constructor for 0, 0
    function Coords(x, y) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
    }
    return Coords;
}());
var Velocity = (function () {
    // TODO: this might not be the best way to have a default constructor for 0, 0
    function Velocity(dx, dy) {
        this.dx = dx == null ? 0 : dx;
        this.dy = dy == null ? 0 : dy;
    }
    return Velocity;
}());
var Style = (function () {
    function Style(stroke, strokeColor, fillColor) {
        this.FillColor = fillColor;
        this.StrokeColor = strokeColor;
        this.Stroke = stroke;
    }
    ;
    Style.prototype.Draw = function (context) {
        if (this.FillColor != null) {
            context.fillStyle = this.FillColor;
            context.fill();
        }
        context.lineWidth = this.Stroke;
        context.strokeStyle = this.StrokeColor;
        context.stroke();
    };
    ;
    return Style;
}());
var Kinematics = (function () {
    function Kinematics(origin, pos, velocity, angularVelocity, angle) {
        this.Origin = origin;
        this.Pos = pos;
        this.Velocity = velocity;
        this.AngularVelocity = angularVelocity == null ? 0 : angularVelocity;
        this.Angle = angle == null ? 0 : angle;
    }
    Kinematics.prototype.Move = function () {
        this.Pos = { x: this.Pos.x + this.Velocity.dx, y: this.Pos.y + this.Velocity.dy };
    };
    return Kinematics;
}());
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
