import { ILoop } from "@/common/interfaces/loop.js";
import { IUpdateable } from "@/common/interfaces/updatable.js";
import { Camera, Clock, Scene, WebGLRenderer } from "three";

function createLoop(camera: Camera, scene: Scene, renderer: WebGLRenderer): ILoop {
    const clock = new Clock();
    const updatables: IUpdateable[] = [];

    function start() {
        renderer.setAnimationLoop(() => {
            // tell every animated object to tick forward one frame
            tick();

            // render a frame
            renderer.render(scene, camera);

        });
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    function addUpdatable(updatable: IUpdateable) {
        updatables.push(updatable);
    }

    function tick() {
        const elapsedTime = clock.elapsedTime;
        const delta = clock.getDelta();
        for (const obj of updatables) {
            obj.tick(delta, elapsedTime);
        }
    }


    return {
        start,
        stop,
        addUpdatable
    }
}

export { createLoop };