import * as THREE from '../../../node_modules/three/build/three.module.js';

function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 'white' );

    return scene;
}

export { createScene };
