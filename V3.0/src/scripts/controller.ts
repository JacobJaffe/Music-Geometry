/**
 * Created by JacobJaffe on 9/22/17.
 */

function init(containerId: string, canvasId: string)
{
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
    var master_circle_kinematics = new Kinematics({x: canvas.width / 2, y: canvas.height / 2}, new Coords(), new Velocity());

    var master_circle = new Circle(master_circle_kinematics, master_circle_style, master_circle_radius);

    var ball_radius = master_circle_radius / 5;
    var ball_style = new Style(1, "red", "red");
    var ball_kinematics = new Kinematics(
                            master_circle.Kinematics.Pos,
                            new Coords(randomIntFromInterval(-master_circle_radius / 2, master_circle_radius / 2), randomIntFromInterval(-master_circle_radius / 2, master_circle_radius / 2)),
                            new Velocity(randomIntFromInterval(-10, 10), randomIntFromInterval(-10, 10)));

    var ball = new Circle(ball_kinematics, ball_style, ball_radius);
    master_circle.AddChild(ball);

    master_controller.AddShape(master_circle);

    master_controller.TogglePlaying();

}

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

class Controller
{
    Display: View;
    Shapes: Shape[];
    IsPlaying: boolean;
    Speed: number;

    constructor(display: View) {
        this.Display = display;
        this.Speed = 1;
        this.IsPlaying = false;
        this.Shapes = [];
    }

    AddShape (new_shape: Shape) {
        this.Shapes.push(new_shape);
    }

    TogglePlaying () {
        this.IsPlaying = !this.IsPlaying;
        if (this.IsPlaying) {
            requestAnimationFrame(() => {
                this.DrawFrame();
            });
        }
    }

    private DrawFrame () {
        this.Display.Context.clearRect(0, 0, this.Display.Canvas.width, this.Display.Canvas.height);
        var scale = this.Display.resize();

        for (var shape of this.Shapes) {
            // TODO: consider, for efficiency, having resetting of origin only occur if resize has occured
            shape.Kinematics.Origin = {x: this.Display.Canvas.width / 2, y: this.Display.Canvas.height / 2};
            shape.Resize(scale);
            shape.Move();
            shape.Draw(this.Display.Context);
        }

        // recursively request frames while controller is active
        if (this.IsPlaying) {
            requestAnimationFrame(() => {
                this.DrawFrame();
            });
        }
    }
}


// TODO: own file

/**
 * Created by JacobJaffe on 9/24/17.
 */

//namespace Shapes {

    abstract class Shape
    {
        Kinematics: Kinematics;
        Children: Shape[];
        Style: Style;
        constructor(kinematics, style) {
            this.Kinematics = kinematics;
            this.Children = [];
            this.Style = style;
        };

        // computes next frame
        Draw(context: CanvasRenderingContext2D) : void {
            this.DrawSelf(context);
            this.DrawChildren(context);
        }

        abstract DrawSelf(context: CanvasRenderingContext2D) : void;

        DrawChildren(context: CanvasRenderingContext2D) : void {
            for (var child of this.Children) {
                child.Kinematics.Origin = {x: this.Kinematics.Origin.x + this.Kinematics.Pos.x, y: this.Kinematics.Origin.y + this.Kinematics.Pos.y};

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
        }

        Resize(scale: number) : void {
            this.ResizeSelf(scale);
            this.ResizeChildren(scale);
        }

        abstract ResizeSelf(scale: number): void;

        ResizeChildren(scale: number) {
            for (var child of this.Children) {
                child.Resize(scale);
            }
        }

        Move() {
            this.MoveSelf();
            this.MoveChildren();
        }

        MoveSelf() {
            this.Kinematics.Move();
        }

        MoveChildren() {
            for (var child of this.Children) {
                child.Move();
            }
        }


        AddChild(shape: Shape) {
            this.Children.push(shape);
        }

        //TODO: Make this based on the perimiters of both shapes, don't assume the child to be a circle also!!
        abstract isChildColliding(child: Shape): boolean;

    }

    //
    // SHAPES:
    //

    class Circle extends  Shape {

        Radius: number;
        constructor(kinematics: Kinematics, style: Style, radius: number) {
            super(kinematics, style);
            this.Radius = radius;
        }

        DrawSelf(context: CanvasRenderingContext2D) : void {
            context.beginPath();
            var x = this.Kinematics.Pos.x + this.Kinematics.Origin.x;
            var y = this.Kinematics.Pos.y + this.Kinematics.Origin.y;
            context.arc(x, y, this.Radius, this.Kinematics.Angle, this.Kinematics.Angle + 2 * Math.PI);

            this.Style.Draw(context);
        }

        ResizeSelf(scale: number) {
            this.Radius = this.Radius * scale;
        }

        //TODO: MAKE GENERIC
        isChildColliding(child: Shape): boolean {
            var circle_child =  <Circle>child;
            if (Math.sqrt(circle_child.Kinematics.Pos.x * circle_child.Kinematics.Pos.x + circle_child.Kinematics.Pos.y * circle_child.Kinematics.Pos.y) + circle_child.Radius >= this.Radius) {
                return true;
            }
            return false;
        }
    }



//}

class Coords {
    x: number;
    y: number;

    // TODO: this might not be the best way to have a default constructor for 0, 0
    constructor(x?: number, y?: number) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
    }
}

class Velocity {
    dx: number;
    dy: number;

    // TODO: this might not be the best way to have a default constructor for 0, 0
    constructor(dx?: number, dy?: number) {
        this.dx = dx == null ? 0 : dx;
        this.dy = dy == null ? 0 : dy;
    }
}

class Style {
        FillColor: string;
        StrokeColor: string;
        Stroke: number;

        constructor(stroke: number, strokeColor: string, fillColor?: string) {
            this.FillColor = fillColor;
            this.StrokeColor = strokeColor;
            this.Stroke = stroke;
        };

        Draw(context: CanvasRenderingContext2D): void {
            if (this.FillColor != null) {
                context.fillStyle = this.FillColor;
                context.fill();
            }

            context.lineWidth = this.Stroke;
            context.strokeStyle = this.StrokeColor;

            context.stroke();
        };
}

class Kinematics {
        Origin: Coords;
        Pos: Coords;
        Velocity: Velocity;
        AngularVelocity: number;
        Angle: number;

        constructor(origin: Coords, pos: Coords, velocity: Velocity, angularVelocity?: number, angle?: number) {
            this.Origin = origin;
            this.Pos = pos;
            this.Velocity = velocity;
            this.AngularVelocity = angularVelocity == null ? 0 : angularVelocity;
            this.Angle = angle == null ? 0 : angle;
        }

        Move(): void {
            this.Pos = {x: this.Pos.x + this.Velocity.dx, y: this.Pos.y + this.Velocity.dy}
        }
}

function randomIntFromInterval (min, max) : number
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}