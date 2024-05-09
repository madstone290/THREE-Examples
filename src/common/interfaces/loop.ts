import { IUpdateable } from "./updatable.js";

interface ILoop {
    start(): void;
    stop(): void;
    addUpdatable(updatable: IUpdateable): void;
}

export type { ILoop };