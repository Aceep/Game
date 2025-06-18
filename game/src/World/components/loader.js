import * as THREE from '../../../node_modules/three/build/three.module.js';
import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';


const modelPaths = {
    Goleling: 'ressources/game/Goleling.gltf',
};

class Loaders {
    constructor() {
        this.loaders = {};
    }

    async loaderGLTF(name) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('./node_modules/three/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        const path = modelPaths[name];
        console.log('Loading ' + name + ' from ' + path);
        console.log('Loading ' + modelPaths);
        loader.load(
            modelPaths[name],
            (gltf) => {
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                const object = gltf.scene;
                // if (gltf.animations && gltf.animations.length) {
                //     object.mixer = new THREE.AnimationMixer(object);
                //     gltf.animations.forEach((clip) => {
                //         const action = object.mixer.clipAction(clip);
                //         object.actions.push(action);
                //     });
                //     object.playNextAction();
                // }
                console.log('object', object);
                resolve(object);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.log('An error happened');
                reject(error);
            });
    });
    }

}   

export { Loaders };