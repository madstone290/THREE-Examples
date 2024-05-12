import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer, OrbitControls } from "three/examples/jsm/Addons.js";


class World {
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    webGLRender: THREE.WebGLRenderer;
    cssRenderer: CSS3DRenderer;
    constructor() {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.webGLRender = this.createWebGLRenderer();
        this.cssRenderer = this.createCSS3DRenderer();
        this.createControls(this.camera, this.cssRenderer);
        this.addAxesHelper(this.scene);
        this.addLights(this.scene);

        this.addPlane(100, 100, 'red', new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0));
        this.addPlane(100, 100, 'green', new THREE.Vector3(0, 0, -50), new THREE.Euler(0, Math.PI / 2, 0));
        this.addPlane(100, 100, 'blue', new THREE.Vector3(0, 0, 50), new THREE.Euler(0, -Math.PI / 2, 0));
        this.addPlane(100, 100, 'yellow', new THREE.Vector3(50, 0, 0), new THREE.Euler(0, -Math.PI / 2, 0));
    }

    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("skyblue");
        return scene;
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const frustumSize = 500;
        const camera = new THREE.OrthographicCamera(
            frustumSize * aspect / - 2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / - 2,
            1,
            1000);
        camera.position.set(-200, 200, 200);
        camera.lookAt(0, 0, 0);
        return camera;
    }

    createWebGLRenderer() {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    createCSS3DRenderer() {
        const renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.classList.add('for-test-purpose');
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    createControls(camera: THREE.Camera, cssRender: CSS3DRenderer) {
        const controls = new OrbitControls(camera, cssRender.domElement);
        controls.minZoom = 0.5;
        controls.maxZoom = 2;
    }

    addPlane(width: number, height: number, cssColor: string,
        pos: THREE.Vector3, rot: THREE.Euler) {
        const material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true,
            wireframeLinewidth: 1,
            side: THREE.DoubleSide
        });
        const element = document.createElement('div');
        element.style.width = width + 'px';
        element.style.height = height + 'px';
        element.style.opacity = "0.75";
        element.style.background = cssColor;
        element.textContent = cssColor;

        const object = new CSS3DObject(element);
        object.position.copy(pos);
        object.rotation.copy(rot);
        this.scene.add(object);

        const geometry = new THREE.PlaneGeometry(width, height);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(pos);
        mesh.rotation.copy(rot);
        this.scene.add(mesh);

        return mesh;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.webGLRender.render(this.scene, this.camera);
        this.cssRenderer.render(this.scene, this.camera);
    }

    addAxesHelper(scene: THREE.Scene) {
        const axesHelper = new THREE.AxesHelper(100);
        axesHelper.layers.enableAll();
        scene.add(axesHelper);
    }

    addLights(scene: THREE.Scene) {
        const ambientLight = new THREE.HemisphereLight(
            'white', // bright sky color
            'darkslategrey', // dim ground color
            1, // intensity
        );
        ambientLight.layers.enableAll();

        // create a directional light
        const sunLight = new THREE.DirectionalLight('white', 3);
        sunLight.layers.enableAll();
        sunLight.position.set(0, 50, -50);
        sunLight.castShadow = true;
        sunLight.lookAt(0, 0, 0);

        sunLight.shadow.mapSize.width = 512; // default
        sunLight.shadow.mapSize.height = 512; // default
        sunLight.shadow.camera.near = 0.5; // default
        sunLight.shadow.camera.far = 100; // default
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        sunLight.shadow.camera.zoom = 1;

        const helper = new THREE.CameraHelper(sunLight.shadow.camera);
        //sunLight.add(helper);

        scene.add(sunLight);
        scene.add(ambientLight);
    }

}

export { World };