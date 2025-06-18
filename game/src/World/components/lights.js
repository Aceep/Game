import * as THREE from '../../../node_modules/three/build/three.module.js';
import { fieldWidth, fieldLength } from '../world.js';

function createSpotLights(color, intensity) {
    const light = new THREE.SpotLight( color, intensity );
    light.decay = 1;
    light.penumbra = 0.5;
    light.distance = 200;
    light.angle = Math.PI/2;
    light.castShadow = true;
    light.position.set(0, 0, 40);
    light.shadow.mapSize.set(4096, 4096);

    return light;
}

function rotateSpotLight(spotLight, ball) {
    setInterval(function () {
        var ballPosition = ball.mesh.position.clone();

        spotLight.target.position.copy(ballPosition);
        spotLight.target.updateMatrixWorld();
        spotLight.rotation.z = Math.atan2(ballPosition.y, ballPosition.x);

        var spotLightPosition = ballPosition.clone().add(new THREE.Vector3(1, 1, 70));
        spotLight.position.copy(spotLightPosition);
    }, 16);
}

function addLightToWorld(world, light) {
    world.scene.add(light);
    world.lights.push(light);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    Default    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function createDefaultLights(world) {
    const ambientLight = new THREE.AmbientLight('white', 2);
    addLightToWorld(world, ambientLight);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    FOOT    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function createFootLights(world) {

    const ambientLight = new THREE.AmbientLight('white', 0.3);
    addLightToWorld(world, ambientLight);

    const positions = [
        { x: -fieldWidth / 2, y: -fieldLength / 2, targetX: -fieldWidth / 3, targetY: -fieldLength / 3 },
        { x: -fieldWidth / 2, y: fieldLength / 2, targetX: -fieldWidth / 3, targetY: fieldLength / 3 },
        { x: fieldWidth / 2, y: -fieldLength / 2, targetX: fieldWidth / 3, targetY: -fieldLength / 3 },
        { x: fieldWidth / 2, y: fieldLength / 2, targetX: fieldWidth / 3, targetY: fieldLength / 3 }
    ];

    positions.forEach(({ x, y, targetX, targetY }) => {
        const spotLight = createSpotLights('white', 100);
        spotLight.position.set(x, y, 100);
        spotLight.target.position.set(targetX, targetY, 1);
        addLightToWorld(world, spotLight);
    });

    const spotLightBall = createSpotLights('white', 100);
    rotateSpotLight(spotLightBall, world.ball);
    addLightToWorld(world, spotLightBall);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    OCEAN    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function createOceanLights(world) {
    const ambientLight = new THREE.AmbientLight(0xd0e0ff, 1);
    addLightToWorld(world, ambientLight);

    const sunLight = new THREE.DirectionalLight(0xf5f5dc, 1.5);
    sunLight.position.set(100, 50, 200);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(4096, 4096);
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000;
    sunLight.shadow.camera.top = 500;
    sunLight.shadow.camera.right = 500;
    sunLight.shadow.camera.left = -500;
    sunLight.shadow.camera.bottom = -500;

    addLightToWorld(world, sunLight);
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    NEON    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function createNeonLights(world) {
    const ambientLight = new THREE.AmbientLight('white', 1);
    addLightToWorld(world, ambientLight);
}

export { createDefaultLights, createFootLights, createOceanLights, createNeonLights };

/*
    function animateLights() {
        requestAnimationFrame(animateLights);
        const time = Date.now() * 0.001;
        const zVariationAmplitude = 10;

        light1.position.x = 140 * Math.sin(time);
        light1.position.y = 100 * Math.sin(time);
        light1.position.z = 50 + zVariationAmplitude * Math.sin(time * 2);

        light2.position.x = 140 * Math.sin(time + Math.PI / 2);
        light2.position.y = 100 * Math.sin(time + Math.PI / 2);
        light2.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + Math.PI / 2);

        light3.position.x = 140 * Math.sin(time + Math.PI);
        light3.position.y = 100 * Math.sin(time + Math.PI);
        light3.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + Math.PI);

        light4.position.x = 140 * Math.sin(time + 3 * Math.PI / 2);
        light4.position.y = 100 * Math.sin(time + 3 * Math.PI / 2);
        light4.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + 3 * Math.PI / 2);

        light1.intensity = 1000 + Math.sin(time * 5);
        light2.intensity = 1000 + Math.sin(time * 5 + Math.PI / 2);
        light3.intensity = 1000 + Math.sin(time * 5 + Math.PI);
        light4.intensity = 1000 + Math.sin(time * 5 + 3 * Math.PI / 2);
    }

    function animateLights() {
        requestAnimationFrame(animateLights);

        const time = Date.now() * 0.0001;
        const zVariationAmplitude = 10;

        light1.position.x = 140 * Math.cos(time);
        light1.position.y = 100 * Math.sin(time) * Math.cos(time);
        light1.position.z = 50 + zVariationAmplitude * Math.sin(time * 2);

        light2.position.x = 140 * Math.sin(time + Math.PI / 2);
        light2.position.y = 100 * Math.sin(time + Math.PI / 2) * Math.cos(time + Math.PI / 2);
        light2.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + Math.PI / 2);

        light3.position.x = 140 * Math.cos(time + Math.PI);
        light3.position.y = 100 * Math.sin(time + Math.PI) * Math.cos(time + Math.PI);
        light3.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + Math.PI);

        light4.position.x = 140 * Math.sin(time + 3 * Math.PI / 2);
        light4.position.y = 100 * Math.sin(time + 3 * Math.PI / 2) * Math.cos(time + 3 * Math.PI / 2);
        light4.position.z = 50 + zVariationAmplitude * Math.sin(time * 2 + 3 * Math.PI / 2);

        light1.intensity = 400 + Math.sin(time * 5);
        light2.intensity = 400 + Math.sin(time * 5 + Math.PI / 2);
        light3.intensity = 400 + Math.sin(time * 5 + Math.PI);
        light4.intensity = 400 + Math.sin(time * 5 + 3 * Math.PI / 2);
    }

    const light1 = createSpotLights(0xff0000, 40);
    const light2 = createSpotLights(0x00ff00, 40);
    const light3 = createSpotLights(0x0000ff, 40);
    const light4 = createSpotLights(0xffff00, 40);

    world.scene.add(light1, light2, light3, light4);
    world.lights.push(light1, light2, light3, light4);

    function animateLights() {
        requestAnimationFrame(animateLights);

        const time = Date.now() * 0.0000001;
        const zVariationAmplitude = 10;

        light1.position.x = 200 * Math.cos(time);
        light1.position.y = 100 * Math.sin(time) * Math.cos(time);
        light1.position.z = 80 + zVariationAmplitude * Math.sin(time * 2);

        light2.position.x = 200 * Math.sin(time + Math.PI / 2);
        light2.position.y = 100 * Math.sin(time + Math.PI / 2) * Math.cos(time + Math.PI / 2);
        light2.position.z = 80 + zVariationAmplitude * Math.sin(time * 2 + Math.PI / 2);

        light3.position.x = 200 * Math.cos(time + Math.PI);
        light3.position.y = 100 * Math.sin(time + Math.PI) * Math.cos(time + Math.PI);
        light3.position.z = 80 + zVariationAmplitude * Math.sin(time * 2 + Math.PI);

        light4.position.x = 200 * Math.sin(time + 3 * Math.PI / 2);
        light4.position.y = 100 * Math.sin(time + 3 * Math.PI / 2) * Math.cos(time + 3 * Math.PI / 2);
        light4.position.z = 80 + zVariationAmplitude * Math.sin(time * 2 + 3 * Math.PI / 2);

        light1.intensity = 40 + Math.sin(time * 5);
        light2.intensity = 40 + Math.sin(time * 5 + Math.PI / 2);
        light3.intensity = 40 + Math.sin(time * 5 + Math.PI);
        light4.intensity = 40 + Math.sin(time * 5 + 3 * Math.PI / 2);
    }
    animateLights();
}
*/
