import * as THREE from '../../../node_modules/three/build/three.module.js';
import { FBXLoader } from '../../../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import { setupModel } from './setupModel.js';
import { modelsPath } from '../../dataModels.js';

class Birds {
    constructor() {
        this.birds = {};
    }

    async loadBirds() {
        const loader = new GLTFLoader();

        const [parrotData, flamingoData] = await Promise.all([
            loader.loadAsync('ressources/game/customs/birds/Parrot.glb'),
            loader.loadAsync('ressources/game/customs/birds/Flamingo.glb'),
        ]);

        const parrot = setupModel(parrotData);
        parrot.position.set(-200, 80, 20);
        parrot.rotation.y = Math.PI / 2;

        const flamingo = setupModel(flamingoData);
        flamingo.position.set(200, 80, 20);
        flamingo.rotation.y = - Math.PI / 2;
        flamingo.castShadow = true;
        flamingo.receiveShadow = true;

        this.birds = { parrot, flamingo };
        return { parrot, flamingo };
    }

    stopBirds(updatables) {
        if (this.birds.parrot) updatables.pop(this.birds.parrot);
        if (this.birds.flamingo) updatables.pop(this.birds.flamingo);
    }

    removeBirdsFromScene(scene) {
        if (this.birds.parrot) scene.remove(this.birds.parrot);
        if (this.birds.flamingo) scene.remove(this.birds.flamingo);
    }

    addBirdsToScene(scene) {
        if (this.birds.parrot) scene.add(this.birds.parrot);
        if (this.birds.flamingo) scene.add(this.birds.flamingo);
    }

    animateBirds(updatables) {
        if (this.birds.parrot) updatables.push(this.birds.parrot);
        if (this.birds.flamingo) updatables.push(this.birds.flamingo);
    }
}

class Michelle {
    constructor() {
        this.michelle = {};
    }

    async loadMichelle() {
        const loader = new GLTFLoader();
        const michelleData = await loader.loadAsync('ressources/game/customs/samba/Michelle.glb');

        const michelle = setupModel(michelleData);
        michelle.scale.set(0.2,0.2,0.2);
        michelle.position.set(0, 99, 0);
        michelle.castShadow = true;
        michelle.receiveShadow = true;

        this.michelle = michelle;
        return michelle;
    }

    stopMichelle(updatables) {
        if (this.michelle) updatables.pop(this.michelle);
    }

    removeMichelleFromScene(scene) {
        if (this.michelle) scene.remove(this.michelle);
    }

    addMichelleToScene(scene) {
        if (this.michelle) scene.add(this.michelle);
    }

    animateMichelle(updatables) {
        if (this.michelle) updatables.push(this.michelle);
    }
}

class Samba { 
    constructor() {
        this.samba = {};
    }

    async loadSamba() {
        const loader = new FBXLoader();
        const sambaData = await loader.loadAsync('ressources/game/customs/samba/SambaDancing.fbx');

        const mixer = new THREE.AnimationMixer(sambaData);
        const action = mixer.clipAction(sambaData.animations[0]);
        action.play();

        sambaData.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.color.set('darkblue');
                child.material.emissive = new THREE.Color('white');
                child.material.emissiveIntensity = 0.2;
                child.material.needsUpdate = true; 
            }
        });

        const samba = sambaData;
        samba.scale.set(0.2, 0.2, 0.2);
        samba.position.set(0, 99, 0);
        samba.rotateX(Math.PI / 2);
        samba.castShadow = true;
        samba.receiveShadow = true;

        samba.tick = (delta) => mixer.update(delta);

        this.samba = samba;

        return samba;
    }

    stopSamba(updatables) {
        if (this.samba) updatables.pop(this.samba);
    }

    removeSambaFromScene(scene) {
        if (this.samba) scene.remove(this.samba);
    }

    addSambaToScene(scene) {
        if (this.samba) scene.add(this.samba);
    }

    animateSamba(updatables) {
        if (this.samba) updatables.push(this.samba);
    }

}

class GLTFObject {
    constructor() {
        this.object = null;
        this.name = null;
        this.mixer = null;
        this.actions = [];
        this.activeAction = null;
        this.actionIndex = 0;
        this.isRemoved = false;
        this.light = null;
    }

    playNextAction() {
        if (this.isRemoved) return;
        if (this.activeAction) {
            this.activeAction.stop();
        }

        this.activeAction = this.actions[this.actionIndex];
        this.activeAction.reset().play();

        this.actionIndex = Math.floor(Math.random() * 101) % this.actions.length;

        // Use an arrow function to maintain the context of `this`
        setTimeout(() => this.playNextAction(), 2000);
    }

    playAction(index) {
        if (this.activeAction) {
            this.activeAction.stop();
        }

        this.activeAction = this.actions[index];
        this.activeAction.reset().play();

        // Use an arrow function to maintain the context of `this`
        //setTimeout(() => this.playNextAction(), 5000);
    }

    async loadGLTFObject(name) {
        return new Promise((resolve, reject) => {
            const loader = new GLTFLoader();
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('./node_modules/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);

            this.name = name;
            loader.load(
                modelsPath[name].path,
                (gltf) => {
                    gltf.scene.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    this.object = gltf.scene;
                    if (gltf.animations && gltf.animations.length) {
                        this.mixer = new THREE.AnimationMixer(this.object);
                        gltf.animations.forEach((clip) => {
                            const action = this.mixer.clipAction(clip);
                            this.actions.push(action);
                        });
                    }
                    resolve(this.object);
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

    tick(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    cleanup() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        if (this.object) {
            this.object.traverse((child) => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.object.parent.remove(this.object);
        }
    }

    async setLeftParticularities(scene) {
        this.object.position.set(-20, -80, 10);
        this.object.scale.set(modelsPath[this.name].scale, modelsPath[this.name].scale, modelsPath[this.name].scale);
        this.object.rotation.x = Math.PI / 2;
        this.object.rotation.y = Math.PI / 6;
        
        this.light = new THREE.SpotLight('white', 1000);
        this.light.position.set(-20, -100, 40);
        this.light.target = this.object;
        this.light.castShadow = true;
        scene.add(this.light);
    }

    async setRightParticularities(scene) {
        this.object.position.set(20, -80, 10);
        this.object.scale.set(modelsPath[this.name].scale, modelsPath[this.name].scale, modelsPath[this.name].scale);
        this.object.rotation.x = Math.PI / 2;
        this.object.rotation.y = -Math.PI / 6;
        
        this.light = new THREE.SpotLight('white', 1000);
        this.light.position.set(20, -100, 40);
        this.light.target = this.object;
        this.light.castShadow = true;
        scene.add(this.light);
    }

    removeObject(scene, updatables) {
        if (this.object) {
            scene.remove(this.object);
            updatables.pop(this.object);
            scene.remove(this.light);
            this.isRemoved = true;
        };
    }

    addObject(scene, updatables) {
        if (this.object) {
            scene.add(this.object);
            updatables.push(this);
            this.playNextAction();
        }
    }

}

class FBXObject {
    constructor() {
        this.object = null;
        this.name = null;
        this.mixer = null;
        this.actions = [];
        this.activeAction = null;
        this.actionIndex = 0;
        this.isRemoved = false;
        this.light = null;
    }

    playNextAction() {
        if (this.isRemoved) return;

        if (this.activeAction) {
            this.activeAction.stop();
        }

        this.activeAction = this.actions[this.actionIndex];
        this.activeAction.reset().play();

        this.actionIndex = Math.floor(Math.random() * 101) % this.actions.length;

        // Use an arrow function to maintain the context of `this`
        setTimeout(() => this.playNextAction(), 3000);
    }

    playAction(index) {
        if (this.activeAction) {
            this.activeAction.stop();
        }

        this.activeAction = this.actions[index];
        this.activeAction.reset().play();

        // Use an arrow function to maintain the context of `this`
        //setTimeout(() => this.playNextAction(), 5000);
    }

    async loadFBXObject(name) {
        return new Promise((resolve, reject) => {
            const loader = new FBXLoader();
            this.name = name;
            loader.load(
                modelsPath[name].path,
                (fbx) => {
                    fbx.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.color = new THREE.Color('darkblue');
                            child.material.emissive = new THREE.Color('white');
                            child.material.emissiveIntensity = 2;
                            child.material.needsUpdate = true; 
                            child.geometry.computeVertexNormals(); // Recalcule les normales des sommets
                        }
                    });
                    this.object = fbx;
                    this.mixer = new THREE.AnimationMixer(this.object);
                    fbx.animations.forEach((clip) => {
                        const action = this.mixer.clipAction(clip);
                        this.actions.push(action);
                    });
                    resolve(this.object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.log('An error happened');
                    reject(error);
                }
            );
        });
    }
    

    tick(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }

    async setLeftParticularities(scene) {
        this.object.position.set(-20, -80, 10);
        this.object.scale.set(modelsPath[this.name].scale, modelsPath[this.name].scale, modelsPath[this.name].scale);
        this.object.rotation.x = Math.PI / 2;
        this.object.rotation.y = Math.PI / 6;
        
        this.light = new THREE.SpotLight('white', 1000);
        this.light.position.set(-20, -100, 40);
        this.light.target = this.object;
        this.light.castShadow = true;
        scene.add(this.light);
    }

    async setRightParticularities(scene) {
        this.object.position.set(20, -80, 10);
        this.object.scale.set(modelsPath[this.name].scale, modelsPath[this.name].scale, modelsPath[this.name].scale);
        this.object.rotation.x = Math.PI / 2;
        this.object.rotation.y = -Math.PI / 6;
    
        this.light = new THREE.SpotLight('white', 1000);
        this.light.position.set(-20, -100, 40);
        this.light.target = this.object;
        this.light.castShadow = true;
        scene.add(this.light);
    }
    

    removeObject(scene, updatables) {
        if (this.object) {
            scene.remove(this.object);
            updatables.pop(this);
            this.isRemoved = true;
            scene.remove(this.light);
        }
    }

    addObject(scene, updatables) {
        if (this.object) {
            scene.add(this.object);
            updatables.push(this);
            this.playNextAction();
        }
    }
}

export { Birds, Samba, Michelle, GLTFObject, FBXObject};
