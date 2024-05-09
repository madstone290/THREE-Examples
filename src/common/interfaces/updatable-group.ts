import { Group } from "three";
import { IUpdateable } from "./updatable.js";

class UpdatableGroup extends Group implements IUpdateable {
    tickFunc?: (delta: number) => void;
    constructor() {
        super();
    }

    tick(delta: number): void {
        if (this.tickFunc != null) {
            this.tickFunc(delta);
        }
    }

    setTickFunc(tickFunc: (delta: number) => void) {
        this.tickFunc = tickFunc;
    }
}

export { UpdatableGroup };