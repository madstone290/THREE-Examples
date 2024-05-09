import { IUpdateable } from "@/common/interfaces/updatable";
import { createResizer } from "@/common/systems/resizer.js";
import { WorldPrototype } from "@/common/world-prototype.js";
import * as THREE from "three";
import { CSS2DObject, CSS2DRenderer, OrbitControls } from "three/examples/jsm/Addons";

const EARTH_RADIUS = 1;
const MOON_RADIUS = 0.27;

class Css2dWorld extends WorldPrototype {
    labelRenderer: CSS2DRenderer;
    controls: OrbitControls;
    moon?: THREE.Mesh;
    constructor(container: HTMLElement) {
        super(container);
        this.labelRenderer = this.initLabelRenderer(container);
        this.controls = this.initControls(container);
        this.addLights(this.scene);
        this.initGui();
        this.addAxesHelper(this.scene);

        const resizer = createResizer(container, this.camera, this.renderer);
        resizer.resize = () => {
            this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
        };

        this.addObjects();
        this.loop.addUpdatable(this.getUpdatable());
        this.scene.background = new THREE.Color('black');

        this.camera.layers.enableAll();
    }

    initGui() {
        this.gui.title("Camera Layers");
        // add toggle button
        const layers = {
            'Toggle Name': () => {
                this.camera.layers.toggle(0);
            },
            'Toggle Mass': () => {
                this.camera.layers.toggle(1);
            },
            'Enable All': () => {
                this.camera.layers.enableAll();
            },
            'Disable All': () => {
                this.camera.layers.disableAll();
            }
        };
        this.gui.add(layers, "Toggle Name");
        this.gui.add(layers, "Toggle Mass");
        this.gui.add(layers, "Enable All");
        this.gui.add(layers, "Disable All");
        this.gui.open();
    }

    initLabelRenderer(container: HTMLElement) {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        container.appendChild(labelRenderer.domElement);

        return labelRenderer;
    }

    initControls(container: HTMLElement) {
        const controls = new OrbitControls(this.camera, container);
        controls.target.set(0, 0, 0);

        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 200;
        controls.maxPolarAngle = (Math.PI / 2) * 0.9;
        return controls;
    }

    createLabel(text: string) {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.backgroundColor = 'transparent';
        div.style.color = 'white';
        return new CSS2DObject(div);
    }

    addObjects() {
        const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
        const earthMaterial = new THREE.MeshPhongMaterial({
            specular: new THREE.Color(0x777777),
            shininess: 10,
            map: this.textureLoader.load('/assets/textures/planets/earth_atmos_2048.jpg'),
            specularMap: this.textureLoader.load('/assets/textures/planets/earth_specular_2048.jpg'),
            normalMap: this.textureLoader.load('/assets/textures/planets/earth_normal_2048.jpg'),
            normalScale: new THREE.Vector2(0.85, 0.85)
        });
        earthMaterial.map!.colorSpace = THREE.SRGBColorSpace;
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        this.scene.add(earth);

        const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
        const moonMaterial = new THREE.MeshPhongMaterial({
            shininess: 5,
            map: this.textureLoader.load('/assets/textures/planets/moon_1024.jpg')
        });
        moonMaterial.map!.colorSpace = THREE.SRGBColorSpace;
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        this.scene.add(moon);

        earth.layers.enableAll();
        moon.layers.enableAll();

        const earthLabel = this.createLabel('Earth');
        earthLabel.position.set(0, 1.5 * EARTH_RADIUS, 0);
        earthLabel.center.set(0, 1);
        earthLabel.layers.set(0);
        earth.add(earthLabel);

        const earthMassLabel = this.createLabel('5.97237e24 kg');
        earthMassLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
        earthMassLabel.center.set(0, 0);
        earthMassLabel.layers.set(1);
        earth.add(earthMassLabel);

        const moonLabel = this.createLabel('Moon');
        moonLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
        moonLabel.center.set(0, 1);
        moonLabel.layers.set(0);
        moon.add(moonLabel);

        const moonMassLabel = this.createLabel('7.342e22 kg');
        moonMassLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
        moonMassLabel.center.set(0, 0);
        moonMassLabel.layers.set(1);
        moon.add(moonMassLabel);

        this.moon = moon;
    }

    addAxesHelper(scene: THREE.Scene) {
        const axesHelper = new THREE.AxesHelper(100);
        axesHelper.layers.enableAll();
        scene.add(axesHelper);
    }


    addLights(scene: THREE.Scene) {
        //const ambientLight = new AmbientLight('white', 0.5);

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

    getUpdatable(): IUpdateable {
        return {
            tick: (delta: number, elapsed: number) => {

                if (this.moon) {
                    this.moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
                }
                this.labelRenderer.render(this.scene, this.camera);
            }
        }
    }

}

export { Css2dWorld };