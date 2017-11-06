/**
 * Created by JacobJaffe on 11/6/17.
 */
class Coords {
    x: number;
    y: number;

    // TODO: this might not be the best way to have a default constructor for 0, 0
    constructor(x?: number, y?: number) {
        this.x = x == null ? 0 : x;
        this.y = y == null ? 0 : y;
    }
}