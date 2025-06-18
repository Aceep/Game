import * as THREE from '../../../node_modules/three/build/three.module.js';

function createCamera(container) {
    const fov = 65;
    const near = 0.1;
    const far = 1000;
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );

    camera.position.set( 0, 0, 200 );
    camera.lookAt(0, 0, 0);

    return camera;
}

function updateCamera3D(camera) {
    camera.position.set( 0, -100, 200 );
    camera.lookAt(0, 0, 0);
}

function updateOceanCamera(camera) {
    camera.position.set( 0, -300, 150 );
    camera.lookAt(0, 0, 0);
}

function updateCamera2D(camera) {
    camera.position.set( 0, 0, 200 );
    camera.lookAt(0, 0, 0);
}

function updateCameraResultScreen(camera) {
    camera.position.set( 0, -145, 50 );
    camera.lookAt( new THREE.Vector3( 100, 10, 100 ) );
}

export { createCamera, updateCamera3D, updateCamera2D, updateCameraResultScreen, updateOceanCamera };
