import { PerspectiveCamera, WebGLRenderer } from "three";

function createResizer(container: HTMLElement, camera: PerspectiveCamera, renderer: WebGLRenderer) {
    let onResize = () => { };

    function setSize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
    }

    setSize();

    window.addEventListener("resize", () => {
        setSize();

        onResize();
    });

    return {
        set resize(value: any) {
            onResize = value;
        }
    }
}

export { createResizer };