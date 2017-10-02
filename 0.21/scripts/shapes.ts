/**
 * Created by JacobJaffe on 9/24/17.
 */

export module Shapes {

    export abstract class Shape
    {
        Color: string;
        Origin: Coords;
        Pos: Coords;
        Velocity: Velocity;
        RotationalSpeed: number;
        Angle: number;
        Children: Shape[];
        Stroke: number;
        constructor(color: string, pos: Coords, velocity: Velocity, rotationalSpeed: number, angle: number, stroke: number, origin?: Coords) {
            this.Color = color;
            this.Pos = pos;
            this.Velocity = velocity;
            this.RotationalSpeed = rotationalSpeed;
            this.Angle = angle;
            this.Children = [];
            this.Stroke = stroke;

            // for top-level shapes
            this.Origin = origin;
        };

        // computes next frame
        Draw(context: CanvasRenderingContext2D) {
            this.DrawSelf(context);
            this.DrawChildren(context);
        }

        abstract DrawSelf(context: CanvasRenderingContext2D) : void;

        DrawChildren(context: CanvasRenderingContext2D) : void {
            for (var child of this.Children) {
                child.Origin = this.Pos;
                child.Draw(context);
            }
        }

        AddChild(shape: Shape) {
            this.Children.push(shape);
        }

    }

    //
    // SHAPES:
    //

    export class Circle extends  Shape {

        Radius: number;
        constructor(color: string, center: Coords, velocity: Velocity, rotationalSpeed: number, angle: number, stroke: number,
                    radius: number) {
            super(color, center, velocity, rotationalSpeed, angle, stroke);
            this.Radius = radius;
        }

        DrawSelf(context: CanvasRenderingContext2D) : void {
            context.beginPath();
            var x = this.Pos.x + this.Origin.x;
            var y = this.Pos.y + this.Origin.y;
            context.arc(x, y, this.Radius, this.Angle, this.Angle + 2 * Math.PI);

            context.lineWidth = this.Stroke;
            context.strokeStyle = this.Color;
            context.stroke();
        }
    }
}

class Coords {
    x: number;
    y: number;
}

class Velocity {
    dx: number;
    dy: number;
}