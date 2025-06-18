import * as THREE from '../../../node_modules/three/build/three.module.js';
import { MTLLoader } from '../../../node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { getRandomColor } from '../systems/randomColor.js';

const ballRadiusDefault = 3.5;

class Ball {
    constructor () {
        this.mesh   = null;
        this.ballSpeed = 0;
        this.ballSpeedRange = 0;
        this.ballAngle = Math.PI;
        this.radius = ballRadiusDefault;
    }

    async loadDefaultBall() {
        this.radius = ballRadiusDefault
        const ballGeometry = new THREE.BoxGeometry(ballRadiusDefault, ballRadiusDefault, ballRadiusDefault);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
        this.mesh = new THREE.Mesh(ballGeometry, ballMaterial);
        this.mesh.position.set(0, 0, ballRadiusDefault);
        this.mesh.needsUpdate = true;
    }

    async loadFootBall() {
        const loader = new OBJLoader();
        const mltloader = new MTLLoader();

        const mtlData = await mltloader.loadAsync('ressources/game/Foot_Theme/Ball.mtl');
        loader.setMaterials(mtlData);
        const ballData = await loader.loadAsync('ressources/game/Foot_Theme/Ball.obj');
        this.mesh = new THREE.Mesh(ballData.children[0].geometry, ballData.children[0].material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.scale.set(3.5, 3.5, 3.5);

        ballData.children[0].geometry.computeBoundingSphere();
        this.radius = ballData.children[0].geometry.boundingSphere.radius * this.mesh.scale.x;

        this.mesh.position.set(0, 0, this.radius);
        this.mesh.needsUpdate = true;
        console.log('Foot Ball radius:', this.radius.toFixed(1), 'position:', this.mesh.position);
    }

    async loadOceanBall() {
        const loader = new OBJLoader();
        const mltloader = new MTLLoader();

        const mtlData = await mltloader.loadAsync('ressources/game/Ocean_Theme/Octopus.mtl');
        loader.setMaterials(mtlData);
        const ballData = await loader.loadAsync('ressources/game/Ocean_Theme/Octopus.obj');
        this.mesh = new THREE.Mesh(ballData.children[0].geometry, ballData.children[0].material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.scale.set(4, 4, 4);
        this.mesh.rotation.set( Math.PI / 2, Math.PI, 0);

        ballData.children[0].geometry.computeBoundingSphere();
        this.radius = ballData.children[0].geometry.boundingSphere.radius * this.mesh.scale.x;

        this.mesh.position.set(0, 0, this.radius / 2);
        this.mesh.needsUpdate = true;
        console.log('Ocean Ball radius:', this.radius.toFixed(1), 'position:', this.mesh.position);
    }

    async loadNeonBall() {
        this.radius = ballRadiusDefault
        const randomColor = getRandomColor();
        const ballGeometry = new THREE.SphereGeometry(ballRadiusDefault, 32, 32);
        this.ballMaterial = new THREE.MeshPhongMaterial({ 
            color: randomColor,
            emissive: randomColor,
            emissiveIntensity: 0.8,
            shininess: 100
        });
        this.mesh = new THREE.Mesh(ballGeometry, this.ballMaterial);

        this.mesh.position.set(0, 0, ballRadiusDefault);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        this.mesh.needsUpdate = true;
        console.log('Neon Ball', ballRadiusDefault, 'position:', this.mesh.position);
    }

    async switchBall(world, version) {
        if (world.ball.mesh) world.scene.remove(world.ball.mesh);

        this.removeBallFromScene(world.scene);
        switch (version) {
            case 'foot':
                await world.ball.loadFootBall();
                break;
            case 'ocean':
                await world.ball.loadOceanBall();
                break;
            case 'neon':
                await world.ball.loadNeonBall();
                break;
            default:
                await world.ball.loadDefaultBall();
                break;
            }

        world.scene.add(world.ball.mesh);
        world.loop.updateBall(world.ball);
        world.loop.ball = world.ball;
    }

    removeBallFromScene(scene) {
        if (this.mesh) scene.remove(this.mesh);
    }

    start() {
        this.ballSpeed = 120 + this.ballSpeedRange;
    }

    tick(delta) {
        this.mesh.position.x += Math.cos(this.ballAngle) * this.ballSpeed * delta;
        this.mesh.position.y += Math.sin(this.ballAngle) * this.ballSpeed * delta;
    }
}

export { Ball };
