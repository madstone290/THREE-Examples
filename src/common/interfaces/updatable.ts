interface IUpdateable {
    tick(delta: number, elapsed: number): void;
}

export type { IUpdateable };