import { Css2dWorld } from "@/css2d/css2d-world.js";
const app = document.getElementById('app');
if (app) {
    const world = new Css2dWorld(app);
    world.startAnimation();
}


