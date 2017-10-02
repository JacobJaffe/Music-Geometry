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
    var r = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var master_circle = new Circle("blue", {x: 0, y: 0}, {dx: 0, dy: 0}, 0, 0, 3, r);
    master_circle.Origin = {x: canvas.width / 2, y: canvas.height / 2};

    master_circle.AddChild(new Ball("red", {x: 0, y: 0}, {dx: 1, dy: 0}, 0, 0, 1, r / 5));

    master_controller.addShape(master_circle);

    master_controller.togglePlaying();
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

    addShape (new_shape: Shape) {
        this.Shapes.push(new_shape);
    }

    togglePlaying () {
        this.IsPlaying = !this.IsPlaying;
        if (this.IsPlaying) {
            requestAnimationFrame(() => {
                this.drawFrame();
            });
        }
    }

    private drawFrame () {
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
                this.drawFrame();
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
            if (Math.sqrt(circle_child.Pos.x * circle_child.Pos.x + circle_child.Pos.y * circle_child.Pos.y) + circle_child.Radius >= this.Radius) {
                console.log("collision");
                return true;
            }
            return false;
        }
    }



//}

class Coords {
    x: number;
    y: number;
}

class Velocity {
    dx: number;
    dy: number;
}

class Style {
        FillColor: string;
        StrokeColor: string;
        Stroke: number;

        Draw(context: CanvasRenderingContext2D): void {
            if (this.FillColor != null) {
                context.fillStyle = this.FillColor;
            }
            context.fill();

            context.lineWidth = this.Stroke;
            context.strokeStyle = this.StrokeColor;
            context.stroke();
        }
}

class Kinematics {
        Origin: Coords,
        Pos: Coords;
        Velocity: Velocity;
        AngularVelocity: Number;
        Angle: Number;

        Move(): void {
            this.Pos = {x: this.Pos.x + this.Velocity.dx, y: this.Pos.y + this.Velocity.dy}
        }
}