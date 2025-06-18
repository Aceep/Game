import { OrbitControls } from '../../../node_modules/three/examples/jsm/controls/OrbitControls.js';

function createControls(camera, container) {
    const controls = new OrbitControls(camera, container);

    controls.enableDamping = true;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.4;
    controls.minDistance = 10;
    controls.maxDistance = 400;
    controls.dampingFactor = 0.4;
    controls.screenSpacePanning = true;

    controls.tick = () => controls.update();

    return controls;
}

export { createControls };
