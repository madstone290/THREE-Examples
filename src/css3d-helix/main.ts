import * as THREE from 'three';
import TWEEN from "three/examples/jsm/libs/tween.module.js"
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { PAINTING_LIST, Painting } from './painting-list.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/*
Helix 형태로 그림을 배치하는 예제
그림을 랜덤한 위치에 배치하고, 애니메이션을 통해 Helix 형태로 배치한다.
좌/우 화살표 키를 누르면 카메라가 다음/이전 그림을 바라보도록 이동한다.
휠을 이용해 카메라를 다음/이전 그림으로 이동할 수 있다.
*/
let containerEl: HTMLElement = document.getElementById('container')!;
let camera: THREE.PerspectiveCamera;
let scene: THREE.Scene;
let webGLRenderer: THREE.WebGLRenderer;
let cssRenderer: CSS3DRenderer;
let controls: OrbitControls;

/**
 * 그림을 저장하는 배열
 */
const paintingItems: THREE.Object3D[] = [];

/**
 * 헬릭스에서 그림의 위치를 저장하는 배열
 */
const paintingHolders: THREE.Object3D[] = [];

/**
 * 헬릭스에서 카메라의 위치를 저장하는 배열
 */
const cameraHolders: THREE.Object3D[] = [];

/**
 * 현재 보고 있는 그림의 인덱스
 */
let currentPaintingIndex = 0;

/**
 * 마지막으로 보고 있던 그림의 인덱스
 */
let lastPaintingIndex = -1;

let lastMoveTime = Date.now();

/**
 * 카메라 이동 제한 시간. ms 단위
 */
let moveLimit = 50;

function createPaintingCSS(painting: Painting) {
    const frame = document.createElement('div');
    frame.className = 'element';
    frame.style.width = '24rem';
    frame.style.height = 'fit-content';
    frame.style.backgroundColor = 'rgba(0,127,127,' + (Math.random() * 0.5 + 0.25) + ')';

    const img = document.createElement('img');
    img.src = `/assets/images/paintings/${painting.file}`;
    img.style.width = '24rem';
    img.style.height = '30rem';
    frame.appendChild(img);

    const info = document.createElement('div');
    info.style.boxSizing = 'border-box';
    info.style.width = '100%';
    info.style.fontSize = '1.5rem';
    info.style.height = 'fit-content';
    info.style.padding = '1rem';
    info.style.backgroundColor = 'rgba(0,0,0,0.5)';
    info.style.color = 'white';
    frame.appendChild(info);

    const title = document.createElement('div');
    title.textContent = painting.name;
    info.appendChild(title);

    const artist = document.createElement('div');
    artist.textContent = painting.artist;
    info.appendChild(artist);


    const paintingCSS = new CSS3DObject(frame);
    paintingCSS.position.x = Math.random() * 4000 - 2000;
    paintingCSS.position.y = Math.random() * 4000 - 2000;
    paintingCSS.position.z = Math.random() * 4000 - 2000;
    return paintingCSS;
}

function addNavButtons() {
    const buttonNext = document.createElement('button');
    buttonNext.innerText = 'Next';
    buttonNext.style.position = 'absolute';
    buttonNext.style.top = '50%';
    buttonNext.style.right = '-10%';
    buttonNext.addEventListener('click', () => moveCameraToNextPainting());
    containerEl.appendChild(buttonNext);

    const buttonPrevious = document.createElement('button');
    buttonPrevious.innerText = 'Previous';
    buttonPrevious.style.position = 'absolute';
    buttonPrevious.style.top = '50%';
    buttonPrevious.style.left = '-10%';
    buttonPrevious.addEventListener('click', () => moveCameraToPreviousPainting());
    containerEl.appendChild(buttonPrevious);
}

function addPaintingCheckBox() {
    const formItemsEl = document.getElementById('form-items')!;
    for (const painting of PAINTING_LIST) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = "flex-start";
        div.style.paddingLeft = '1rem';
        div.style.width = '100%';
        div.style.fontSize = '1.5rem';
        div.style.textAlign = 'left';

        const inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.style.width = '1.5rem';
        inputEl.style.height = '1.5rem';
        inputEl.style.marginRight = '1rem';
        inputEl.style.flex = '0 0 auto';
        div.appendChild(inputEl);

        const label = document.createElement('div');
        label.innerText = painting.name == null || painting.name == '' ? 'Unknown' : painting.name;
        label.style.flex = '1 1 auto';
        div.appendChild(label);

        formItemsEl.appendChild(div);
    }
}

function init() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 3000;
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);



    webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);
    webGLRenderer.domElement.style.width = '100%';
    webGLRenderer.domElement.style.position = 'absolute';
    containerEl.appendChild(webGLRenderer.domElement);

    cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    cssRenderer.domElement.style.top = '0px';
    cssRenderer.domElement.style.width = '100%';
    cssRenderer.domElement.style.position = 'absolute';
    containerEl.appendChild(cssRenderer.domElement);

    controls = new OrbitControls(camera, cssRenderer.domElement);
    controls.addEventListener('change', () => render());
    controls.enableZoom = false;
    controls.enablePan = false;

    for (let i = 0; i < PAINTING_LIST.length; i++) {
        const paintingCSS = createPaintingCSS(PAINTING_LIST[i]);
        scene.add(paintingCSS);
        paintingItems.push(paintingCSS);

        const theta = i * 0.35 + Math.PI;
        const y = - (i * 80) + 450;

        const paintingHolder = new THREE.Object3D();
        paintingHolder.position.setFromCylindricalCoords(1600, theta, y);
        paintingHolders.push(paintingHolder);

        const cameraHolder = new THREE.Object3D();
        cameraHolder.position.x = paintingHolder.position.x * 2;
        cameraHolder.position.y = paintingHolder.position.y;
        cameraHolder.position.z = paintingHolder.position.z * 2;
        cameraHolders.push(cameraHolder);

        paintingHolder.lookAt(cameraHolder.position);
        cameraHolder.lookAt(paintingHolder.position);
    }


    window.addEventListener('resize', onWindowResize);
    window.addEventListener("keydown", (event) => {
        switch (event.key) {
            case "ArrowRight":
                moveCameraToNextPainting();
                break;
            case "ArrowLeft":
                moveCameraToPreviousPainting();
                break;
        }
    });

    containerEl.addEventListener("wheel", (event) => {
        if (0 < event.deltaY) {
            if (currentPaintingIndex < paintingItems.length) {
                event.preventDefault();
                moveCameraToNextPainting();
            }
        }
        else if (event.deltaY < 0) {
            moveCameraToPreviousPainting();
        }
        console.log(currentPaintingIndex);
    });

    transform(paintingHolders, 2000);
    lookAtPainting(0);
    addNavButtons();

    addPaintingCheckBox();
}

function moveCameraToNextPainting() {
    if (Date.now() - lastMoveTime < moveLimit) {
        return;
    }
    currentPaintingIndex++;
    lookAtPainting(currentPaintingIndex);
    lastMoveTime = Date.now();
}

function moveCameraToPreviousPainting() {
    if (Date.now() - lastMoveTime < moveLimit) {
        return;
    }
    currentPaintingIndex--;
    if (currentPaintingIndex < 0)
        currentPaintingIndex = 0;
    lookAtPainting(currentPaintingIndex);
    lastMoveTime = Date.now();
}

function scalePainting(index: number, scale: number) {
    if (index < 0 || index >= paintingItems.length) {
        return;
    }
    const painting = paintingItems[index];
    new TWEEN.Tween(painting.scale)
        .to({
            x: scale,
            y: scale,
            z: scale
        }, 500)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    new TWEEN.Tween({})
        .to({}, 1000)
        .onUpdate(() => render())
        .start();
}

function lookAtPainting(index: number) {
    if (index < 0 || index >= paintingItems.length) {
        return;
    }
    const nextCamera = cameraHolders[index];
    const nextPainting = paintingHolders[index];

    new TWEEN.Tween(controls.object.position)
        .to({
            x: nextCamera.position.x,
            y: nextCamera.position.y,
            z: nextCamera.position.z
        }, 500)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    new TWEEN.Tween(controls.target)
        .to({
            x: nextPainting.position.x,
            y: nextPainting.position.y,
            z: nextPainting.position.z
        }, 500)
        .easing(TWEEN.Easing.Exponential.InOut)
        .start();

    new TWEEN.Tween({})
        .to({}, 1000)
        .onUpdate(() => render())
        .start();

    scalePainting(lastPaintingIndex, 1);
    scalePainting(index, 1.5);

    lastPaintingIndex = currentPaintingIndex;
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


    camera.aspect = containerEl.clientWidth / containerEl.clientHeight;
    camera.updateProjectionMatrix();

    webGLRenderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
    cssRenderer.setSize(containerEl.clientWidth, containerEl.clientHeight);

    render();

}

function animate() {
    requestAnimationFrame(animate);
    //render();
    TWEEN.update();
    controls.update();
}

function render() {
    webGLRenderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}

init();
render();
animate();
