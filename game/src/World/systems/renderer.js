import * as THREE from '../../../node_modules/three/build/three.module.js';

function createRenderer() {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        gammaInput: true,
        gammaOutput: true,
        logarithmicDepthBuffer: true,
        physicallyCorrectLights: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

    return renderer;
}

export { createRenderer };
