import * as THREE from 'three';
import TWEEN from "three/examples/jsm/libs/tween.module.js"
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { PAINTING_LIST, Painting } from './painting-list.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { cameraPosition } from 'three/examples/jsm/nodes/Nodes.js';

let containerEl: HTMLElement = document.getElementById('container')!;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let webGLRenderer: THREE.WebGLRenderer;
let cssRenderer: CSS3DRenderer;
//let controls: TrackballControls;
let controls: OrbitControls;

const paintingItems: THREE.Object3D[] = [];
const targets: THREE.Object3D[] = [];
const lookAtPositions : THREE.Vector3[] = [];

function createPaintingCSS(painting: Painting) {
    const element = document.createElement('div');
    element.className = 'element';
    element.style.width = '20rem';
    element.style.height = '32rem';
    element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

    const img = document.createElement('img');
    img.src = `/assets/images/paintings/${painting.file}`;
    img.style.width = '100%';
    img.style.height = '100%';
    element.appendChild(img);

    const paintingCSS = new CSS3DObject(element);
    paintingCSS.position.x = Math.random() * 4000 - 2000;
    paintingCSS.position.y = Math.random() * 4000 - 2000;
    paintingCSS.position.z = Math.random() * 4000 - 2000;
    return paintingCSS;
}

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    containerEl.appendChild(webGLRenderer.domElement);

  
    for (let i = 0; i < PAINTING_LIST.length; i++) {
        const paintingCSS = createPaintingCSS(PAINTING_LIST[i]);
        scene.add(paintingCSS);
        paintingItems.push(paintingCSS);

        const theta = i * 0.3 + Math.PI;
        const y = - (i * 80) + 450;

        const paintingPosition = new THREE.Object3D();
        paintingPosition.position.setFromCylindricalCoords(1600, theta, y);

        // 모니터를 바라보도록 설정
        const paintingLookAtPosition = new THREE.Vector3();
        paintingLookAtPosition.x = paintingPosition.position.x * 2;
        paintingLookAtPosition.y = paintingPosition.position.y;
        paintingLookAtPosition.z = paintingPosition.position.z * 2;
        lookAtPositions.push(paintingLookAtPosition);

        paintingPosition.lookAt(paintingLookAtPosition);
        targets.push(paintingPosition);
    }

    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    containerEl.appendChild(cssRenderer.domElement);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = '0px';

    //

    // controls = new TrackballControls(camera, renderer.domElement);
    // controls.rotateSpeed = 10;
    // controls.minDistance = 500;
    // controls.maxDistance = 6000;
    controls = new OrbitControls(camera, cssRenderer.domElement);

    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize);

    transform(targets, 2000);

    let paintingNumber = 0;
    window.addEventListener("keydown", (event) => {

        switch (event.key) {
            // if right arrow, camera move to the next painting
            case "ArrowRight":
                lookAtPainting(paintingNumber++);
                break;
            // if left arrow, camera move to the previous painting
            case "ArrowLeft":
                lookAtPainting(paintingNumber--);
                break;

        }
    });
}

function lookAtPainting(number: number) {
    const location = targets[number];
    const lookAt = lookAtPositions[number];
    new TWEEN.Tween(camera.position)
        .to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 2000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    new TWEEN.Tween(camera.rotation)
        .to({ x: lookAt.x, y: lookAt.y, z: lookAt.z }, 2000)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

        camera.lookAt(location.position);

}

function transform(targets: THREE.Object3D[], duration: number): void {

    TWEEN.removeAll();

    for (let i = 0; i < paintingItems.length; i++) {

        const painting = paintingItems[i];
        const target = targets[i];

        new TWEEN.Tween(painting.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(painting.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }


    new TWEEN.Tween({})
        .to({}, duration * 2)
        .onUpdate(() => render())
        .start();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    cssRenderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

}

function render() {
    webGLRenderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}

init();
animate();
