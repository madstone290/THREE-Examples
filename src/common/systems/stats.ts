import { ILoop } from "@/common/interfaces/loop.js";
import { IUpdateable } from "@/common/interfaces/updatable.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

function createStats(container: HTMLElement, loop: ILoop) {
    const stats = new Stats();
    // bottom-right
    stats.dom.style.position = "fixed";
    stats.dom.style.top = "auto";
    stats.dom.style.left = "auto";
    stats.dom.style.bottom = "0px";
    stats.dom.style.right = "0px";

    container.appendChild(stats.dom);

    const updatable: IUpdateable = {
        tick: () => {
            stats.update();
        }
    };
    loop.addUpdatable(updatable);

    return {
        stats,
        updatable
    };
}

export { createStats };