import * as THREE from '../../../node_modules/three/build/three.module.js';

function setupModel(data) {
    const model = data.scene.children[0];
    model.scale.set(0.4, 0.4, 0.4);
    model.rotateX(Math.PI / 2);

    const clip = data.animations[0];

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(clip);

    action
        .startAt( Math.random() )
        .setEffectiveTimeScale( 0.8 )
        .play();

    model.tick = (delta) => mixer.update(delta);

    return model;
}

export { setupModel };
