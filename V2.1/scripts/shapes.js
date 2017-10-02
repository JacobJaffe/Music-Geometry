/**
 * Created by JacobJaffe on 9/24/17.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shapes;
(function (Shapes) {
    var Shape = (function () {
        function Shape(color, pos, velocity, rotationalSpeed, angle, stroke, origin) {
            this.Color = color;
            this.Pos = pos;
            this.Velocity = velocity;
            this.RotationalSpeed = rotationalSpeed;
            this.Angle = angle;
            this.Children = [];
            this.Stroke = stroke;
            // for top-level shapes
            this.Origin = origin;
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
                child.Origin = this.Pos;
                child.Draw(context);
            }
        };
        Shape.prototype.AddChild = function (shape) {
            this.Children.push(shape);
        };
        return Shape;
    }());
    Shapes.Shape = Shape;
    //
    // SHAPES:
    //
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(color, center, velocity, rotationalSpeed, angle, stroke, radius) {
            _super.call(this, color, center, velocity, rotationalSpeed, angle, stroke);
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
        return Circle;
    }(Shape));
    Shapes.Circle = Circle;
})(Shapes = exports.Shapes || (exports.Shapes = {}));
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
