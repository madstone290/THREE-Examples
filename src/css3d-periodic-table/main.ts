import * as THREE from 'three';
import TWEEN from "three/examples/jsm/libs/tween.module.js"
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { PAINTING_LIST } from './painting-list.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let renderer: CSS3DRenderer;
let controls: TrackballControls;
//let controls: OrbitControls;
  

const objects: any[] = [];
const targets: {
    table: THREE.Object3D[],
    sphere: THREE.Object3D[],
    helix: THREE.Object3D[],
    grid: THREE.Object3D[]
} = {
    table: [], sphere: [], helix: [], grid: []

};


init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // table

    for (let i = 0; i < PAINTING_LIST.length; i++) {

        const element = document.createElement('div');
        element.className = 'element';
        element.style.width = '20rem';
        element.style.height = '32rem';
        element.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

        const img = document.createElement('img');
        img.src = `/assets/images/paintings/${PAINTING_LIST[i].file}`; 
        img.style.width = '100%';
        img.style.height = '100%';
        element.appendChild(img);

        // const number = document.createElement('div');
        // number.className = 'number';
        // number.textContent = ((i / 5) + 1).toString();
        // element.appendChild(number);

        // const symbol = document.createElement('div');
        // symbol.className = 'symbol';
        // symbol.textContent = table[i].toString();
        // element.appendChild(symbol);

        // const details = document.createElement('div');
        // details.className = 'details';
        // details.innerHTML = table[i + 1] + '<br>' + table[i + 2];
        // element.appendChild(details);

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);

        objects.push(objectCSS);

        //

        const object = new THREE.Object3D();

        targets.table.push(object);

    }

    // sphere

    const vector = new THREE.Vector3();

    for (let i = 0, l = objects.length; i < l; i++) {

        const phi = Math.acos(- 1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const object = new THREE.Object3D();

        object.position.setFromSphericalCoords(1200, phi, theta);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);

    }

    // helix

    for (let i = 0, l = objects.length; i < l; i++) {

        const theta = i * 0.5 + Math.PI;
        const y = - (i * 50) + 450;

        const object = new THREE.Object3D();

        object.position.setFromCylindricalCoords(900, theta, y);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.helix.push(object);

    }

    // grid

    for (let i = 0; i < objects.length; i++) {

        const object = new THREE.Object3D();

        object.position.x = ((i % 5) * 400) - 800;
        object.position.y = (- (Math.floor(i / 5) % 5) * 400) + 800;
        object.position.z = (Math.floor(i / 25)) * 1000 - 2000;

        targets.grid.push(object);

    }

    //

    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container')!.appendChild(renderer.domElement);

    //

    controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 10;
    controls.minDistance = 500;
    controls.maxDistance = 6000;
    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;
    controls.addEventListener('change', render);

    const buttonTable = document.getElementById('table')!;
    buttonTable.addEventListener('click', function () {

        transform(targets.table, 2000);

    });

    const buttonSphere = document.getElementById('sphere')!;
    buttonSphere.addEventListener('click', function () {

        transform(targets.sphere, 2000);

    });

    const buttonHelix = document.getElementById('helix')!;
    buttonHelix.addEventListener('click', function () {

        transform(targets.helix, 2000);

    });

    const buttonGrid = document.getElementById('grid')!;
    buttonGrid.addEventListener('click', function () {

        transform(targets.grid, 2000);

    });

    transform(targets.table, 2000);

    //

    window.addEventListener('resize', onWindowResize);

}

function transform(targets: THREE.Object3D[], duration: number): void {

    TWEEN.removeAll();

    for (let i = 0; i < objects.length; i++) {

        const object = objects[i];
        const target = targets[i];

        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
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

    renderer.setSize(window.innerWidth, window.innerHeight);

    render();

}

function animate() {

    requestAnimationFrame(animate);

    TWEEN.update();

    controls.update();

}

function render() {

    renderer.render(scene, camera);

}