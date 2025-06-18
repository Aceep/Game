import * as THREE from '../../../node_modules/three/build/three.module.js';
import { FontLoader } from '../../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../../node_modules/three/examples/jsm/geometries/TextGeometry.js';
import { LEFT, depth } from '../world.js';
import { Paddle } from './paddle.js';

const colors = ['#F7A541', '#F45D4C', '#FA2E59', '#4783c3', '#9c6cb7'];

const URL_FONT_DEFAULT = 'https://threejs.org/examples/fonts/gentilis_bold.typeface.json';
const URL_FONT_THEME = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    var center = new THREE.Vector3();
    geometry.computeBoundingBox();
    geometry.boundingBox.getCenter(center);
    mesh.localToWorld(center);
    return center;
}

class Player {
    constructor(paddleColor, scene, player) {
        this.scoreValue = 0;
        this.theme      = null;
        this.scoreMesh  = null;
        this.scoreLight = null;
        this.scene      = scene;
        this.playerID   = player;
        this.paddle     = new Paddle(paddleColor, player);

        this.rotationInProgress = false;
        this.rotationStartTime  = 0;
        this.rotationDuration   = 1000;
        this.rotationSpeed      = Math.PI * 2;
    }

    addLight2Score(meshCenter, scene) {
        if (this.scoreLight) this.scene.remove(this.scoreLight);

        this.scoreLight = new THREE.SpotLight( 'white', 100 );
        this.scoreLight.castShadow = true;
        this.scoreLight.shadow.mapSize.set(512, 512);
        this.scoreLight.position.set( meshCenter.x, meshCenter.y - 10, meshCenter.z - 15 );
        this.scoreLight.decay = 0.8;
        this.scoreLight.distance = 30;

        const targetMarker = new THREE.Mesh( new THREE.SphereGeometry(), new THREE.MeshBasicMaterial() );
        targetMarker.position.copy(meshCenter);
        targetMarker.visible = false;

        this.scoreLight.target = targetMarker;
        scene.add(this.scoreLight, targetMarker);
    }

    async loadDefaultScore() {
        if (this.scoreMesh) this.scene.remove(this.scoreMesh);

        const loader = new FontLoader();
        const font = await loader.loadAsync(URL_FONT_THEME);
        // const font = await new Promise((resolve, reject) => {
        //     loader.load(URL_FONT_THEME, resolve, undefined, reject);
        // });

        const textGeometry = new TextGeometry( this.scoreValue.toString(), { font: font, size: 25, depth: 0 } )
        const materials = [
            new THREE.MeshBasicMaterial({ color: 'white' }),
            new THREE.MeshBasicMaterial({ color: 'white' })
        ];

        this.scoreMesh = new THREE.Mesh(textGeometry, materials);
        const center = getCenterPoint(this.scoreMesh);
        this.scoreMesh.position.set(this.playerID === LEFT ? 30 - center.x : -30 - center.x, 65, depth);
        this.scoreMesh.needsUpdate = true;
    }

    async loadThemeScore(scene) {
        if (this.scoreMesh) this.scene.remove(this.scoreMesh);

        const loader = new FontLoader();
        const font = await loader.loadAsync(URL_FONT_DEFAULT);
        // const font = await new Promise((resolve, reject) => {
        //     loader.load(URL_FONT_DEFAULT, resolve, undefined, reject);
        // });

        const textGeometry = new TextGeometry( this.scoreValue.toString(), {
            font: font,
            size: 25,
            depth: 4,
            curveSegments: 20,
            bevelEnabled: true,
            bevelSize: 2,
            bevelOffset: 0.2,
            bevelSegments: 3,
            bevelThickness: 2,
        });

        const materials = [
            new THREE.MeshPhongMaterial({ color: colors[2] }),  // front
            new THREE.MeshPhongMaterial({ color: colors[3] })   // side
        ];

        this.scoreMesh = new THREE.Mesh(textGeometry, materials);
        const center = getCenterPoint(this.scoreMesh);
        this.scoreMesh.position.set(this.playerID === LEFT ? 100 - center.x : -100 - center.x, 100, 40);
        this.scoreMesh.rotation.x = Math.PI / 2;
        this.scoreMesh.receiveShadow = true;
        this.scoreMesh.castShadow = true;
        this.scoreMesh.needsUpdate = true;

        this.addLight2Score(getCenterPoint(this.scoreMesh), scene);
    }

    updateScore(score) {
        this.scoreValue = score;

        if (this.theme !== 'default') {
            this.rotationStartTime = Date.now();
            this.rotationInProgress = true;
        } else if (this.theme === 'default') {
            if (this.scoreMesh) this.scene.remove(this.scoreMesh);
            this.loadDefaultScore().then(() => { this.scene.add(this.scoreMesh); });
        }
    }

    updateScoreMesh() {
        if (this.scoreMesh) this.scene.remove(this.scoreMesh);
        this.loadThemeScore(this.scene).then(() => { this.scene.add(this.scoreMesh); });
    }

    tick(delta) {
        if (this.rotationInProgress) {
            const elapsedTime = Date.now() - this.rotationStartTime;
            const rotationProgress = (elapsedTime / this.rotationDuration) * this.rotationSpeed;

            if (rotationProgress >= Math.PI) {
                this.updateScoreMesh();
                this.rotationInProgress = false;
            } else {
                this.scoreMesh.rotation.y += this.rotationSpeed * delta;
            }
        }
    }

    async resetScore() {
        this.updateScore(0);
    }
}

export { Player };
