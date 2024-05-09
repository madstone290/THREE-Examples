import { ILoop } from "@/common/interfaces/loop.js";
import { createLoop } from "@/common/systems/loop.js";
import { createResizer } from "@/common/systems/resizer.js";
import { createStats } from "@/common/systems/stats.js";
import { AxesHelper, Camera, CameraHelper, Color, DirectionalLight, HemisphereLight, PerspectiveCamera, Scene, TextureLoader, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

class WorldPrototype {
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    loop: ILoop;
    gui: GUI;
    textureLoader: TextureLoader = new TextureLoader();

    constructor(container: HTMLElement) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(container);
        this.loop = createLoop(this.camera, this.scene, this.renderer);
        this.gui = new GUI();

        createStats(container, this.loop);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    startAnimation() {
        this.loop.start();
    }

    stopAnimation() {
        this.loop.stop();
    }

    protected createScene() {
        const scene = new Scene();
        scene.background = new Color("skyblue");
        return scene;
    }

    protected createCamera() {
        const camera = new PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000);
        const distance = 25;
        camera.position.set(0, distance / 2, distance);
        return camera;
    }

    protected createRenderer(container: HTMLElement) {
        const renderer = new WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        return renderer;
    }
}

export { WorldPrototype };