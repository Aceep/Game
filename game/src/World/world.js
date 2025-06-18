import * as THREE from '../../node_modules/three/build/three.module.js';
import { createCamera, updateCamera3D, updateCamera2D, updateCameraResultScreen, updateOceanCamera } from './components/camera.js';
import { createDefaultLights, createFootLights, createOceanLights, createNeonLights } from './components/lights.js';
import { Samba, Michelle, Birds, FBXObject, GLTFObject } from './components/animation.js';
import { createScene } from './components/scene.js';
import { Obstacle } from './components/obstacles.js';

import { Loop } from './systems/Loop.js';
import { Ball } from './components/ball.js';
import { Resizer } from './systems/resizer.js';
import { Ground } from './components/ground.js';
import { Player } from './components/player.js';
import { SettingsManager } from './systems/settings.js';
import { ResultManager } from './systems/resultManager.js';


import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { showloadingScreen, hideLoadingScreen } from '../utils.js';

export const LEFT = 0, RIGHT = 1;
export const fieldWidth = 400;
export const fieldLength = 200;
export const depth = 3;

class World {
    constructor(container) {

        this.lights = [];
        this.scene = createScene();
        this.renderer = createRenderer();
        this.camera = createCamera(container);
        this.settingsManager = new SettingsManager(this);
        this.resultManager = new ResultManager(this);

        container.append(this.renderer.domElement);

        this.ball = new Ball();
        this.LeftPlayer = new Player('red', this.scene, LEFT);
        this.RightPlayer = new Player('blue', this.scene, RIGHT);
        this.ground = new Ground(fieldWidth, fieldLength, depth);
        this.samba = null;
        this.birds = null;
        this.obstacles = null;

        this.LeftPaddle = this.LeftPlayer.paddle;
        this.RightPaddle = this.RightPlayer.paddle;

        const controls = createControls(this.camera, this.renderer.domElement);

        this.loop = new Loop(this.ground, this.camera, this.scene, this.renderer, this.ball, this.LeftPlayer, this.RightPlayer, controls, this.settingsManager, this.resultManager, this.ground.pointLight, this.obstacles);
        this.loop.updatables.push(controls, this.ball, this.LeftPlayer, this.RightPlayer, this.LeftPlayer.paddle, this.RightPlayer.paddle);

        const resizer = new Resizer(container, this.camera, this.renderer);
    }

    removeCurrentLights() {
        console.log('removeCurrentLights', this.lights);
        this.lights.forEach(light => {
            this.scene.remove(light);
        });
        this.lights = [];
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    DEFAULT    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    async initDefaultWorld() {

        showloadingScreen();

        try {
            // Update the scene background ---> Step 1
            this.scene.background = new THREE.Color( 'white' );
            this.LeftPlayer.theme = this.RightPlayer.theme = 'default';
            this.removeOceanSky();

            // Update the ground of the playing field ---> Step 2
            await this.ground.switchGround(this, 'default');
            this.loop.updateGroundLight(this.ground.pointLight);
            this.loop.updatePathLight(this.ground.path);

            // Update the camrea position ---> Step 3
            updateCamera2D(this.camera);

            // Update the lights of the scene ---> Step 4
            this.removeCurrentLights();
            createDefaultLights(this);

            // Update the paddles of the players ---> Step 5
            this.LeftPaddle.switchPaddle(this, 'default');
            this.RightPaddle.switchPaddle(this, 'default');

            // Update the ball of the game ---> Step 6
            this.ball.switchBall(this, 'default');

            // Update the score visualisation ---> Step 7
            await this.LeftPlayer.loadDefaultScore();
            this.loop.updatePlayer( null, this.LeftPlayer.paddle, LEFT );
            await this.RightPlayer.loadDefaultScore();
            this.loop.updatePlayer( null, this.RightPlayer.paddle, RIGHT );
            this.scene.add( this.LeftPlayer.scoreMesh, this.RightPlayer.scoreMesh );
        }
        catch (error) {
            console.error('Error loading the default world:', error);
            hideLoadingScreen();
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
        hideLoadingScreen();
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    OCEAN    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    loadOceanSky() {
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                skyColor: { value: new THREE.Color(0xf0f8ff) },
                horizonColor: { value: new THREE.Color(0xd0e0ff) },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vWorldPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
            uniform vec3 skyColor;
            uniform vec3 horizonColor;
            varying vec3 vWorldPosition;
            void main() {
                float h = max(normalize(vWorldPosition).y, 0.0);
                gl_FragColor = vec4( mix(horizonColor, skyColor, h), 1.0);
            }
            `,
            side: THREE.BackSide,
        });
        const skyGeometry = new THREE.SphereGeometry(600, 64, 64);
        const oceanSky = new THREE.Mesh(skyGeometry, skyMaterial);
        oceanSky.position.set(100, 50, 200);
        oceanSky.name = 'oceanSky';
        this.scene.add(oceanSky);
    }

    removeOceanSky() {
        const oceanSkyObject = this.scene.getObjectByName('oceanSky');
        if (oceanSkyObject!== null) {
            this.scene.remove(oceanSkyObject);
        } else {
            console.log('Objet "oceanSky" not found');
        }
    }

    async initOceanWorld() {

        showloadingScreen();

        try {
            //Update the scene background ---> Step 1
            this.scene.background = new THREE.Color( 0xdfefff );
            this.LeftPlayer.theme = this.RightPlayer.theme = 'ocean';

            console.log('initOceanWorld color', this.scene.background);
            // Update the ground of the playing field ---> Step 2
            await this.ground.switchGround(this, 'ocean');
            this.loop.updateGroundLight(this.ground.pointLight);
            this.loop.updatePathLight(this.ground.path);

            // Update the camrea position ---> Step 3
            updateOceanCamera(this.camera);

            // Update the lights of the scene ---> Step 4
            this.removeCurrentLights();
            createOceanLights(this);
            this.loadOceanSky();

            // Update the paddles of the players ---> Step 5
            this.LeftPaddle.switchPaddle(this, 'ocean', LEFT);
            this.RightPaddle.switchPaddle(this, 'ocean', RIGHT);

            // Update the ball of the game ---> Step 6
            this.ball.switchBall(this, 'ocean');

            // Update the score visualisation ---> Step 7
            await this.LeftPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.LeftPlayer.paddle, LEFT );
            await this.RightPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.RightPlayer.paddle, RIGHT );
            this.scene.add( this.LeftPlayer.scoreMesh, this.RightPlayer.scoreMesh );
        }
        catch (error) {
            console.error('Error loading the ocean world:', error);
            hideLoadingScreen();
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        hideLoadingScreen();
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    FOOT    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    async initFootWorld() {

        showloadingScreen();

        try {
            //Update the scene background ---> Step 1
            this.scene.background = new THREE.TextureLoader().load('../../ressources/game/Foot_Theme/Football_Grandstand.jpg');
            this.LeftPlayer.theme = this.RightPlayer.theme = 'foot';
            this.removeOceanSky();

            // Update the ground of the playing field ---> Step 2
            await this.ground.switchGround(this, 'foot');
            this.loop.updateGroundLight(this.ground.pointLight);
            this.loop.updatePathLight(this.ground.path);

            // Update the camrea position ---> Step 3
            updateCamera3D(this.camera);

            // Update the lights of the scene ---> Step 4
            this.removeCurrentLights();
            createFootLights(this);

            // Update the paddles of the players ---> Step 5
            this.LeftPaddle.switchPaddle(this, 'foot', LEFT);
            this.RightPaddle.switchPaddle(this, 'foot', RIGHT);

            // Update the ball of the game ---> Step 6
            this.ball.switchBall(this, 'foot');

            // Update the score visualisation ---> Step 7
            await this.LeftPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.LeftPlayer.paddle, LEFT );
            await this.RightPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.RightPlayer.paddle, RIGHT );
            this.scene.add( this.LeftPlayer.scoreMesh, this.RightPlayer.scoreMesh );
        }
        catch (error) {
            console.error('Error loading the foot world:', error);
            hideLoadingScreen();
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        hideLoadingScreen();
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    NEON    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    async initNeonWorld() {

        showloadingScreen();

        try {
            // Update the scene background ---> Step 1
            this.scene.background = new THREE.Color('black');
            this.LeftPlayer.theme = this.RightPlayer.theme = 'neon';
            this.removeOceanSky();

            // Update the ground of the playing field ---> Step 2
            await this.ground.switchGround(this, 'neon');
            this.loop.updateGroundLight(this.ground.pointLight);
            this.loop.updatePathLight(this.ground.path);

            // Update the camrea position ---> Step 3
            updateCamera3D(this.camera);

            // Update the lights of the scene ---> Step 4
            this.removeCurrentLights();
            createNeonLights(this);

            // Update the paddles of the players ---> Step 5
            this.LeftPaddle.switchPaddle(this, 'neon', LEFT);
            this.RightPaddle.switchPaddle(this, 'neon', RIGHT);

            // Update the ball of the game ---> Step 6
            this.ball.switchBall(this, 'neon');

            // Update the score visualisation ---> Step 7
            await this.LeftPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.LeftPlayer.paddle, LEFT );
            await this.RightPlayer.loadThemeScore(this.scene);
            this.loop.updatePlayer( null, this.RightPlayer.paddle, RIGHT );
            this.scene.add( this.LeftPlayer.scoreMesh, this.RightPlayer.scoreMesh );
        }
        catch (error) {
            console.error('Error loading the neon world:', error);
            hideLoadingScreen();
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        hideLoadingScreen();
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    INIT    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    async init() {
        await this.initDefaultWorld();

        this.scene.add( this.ball.mesh, this.ground.mesh );
        this.scene.add( this.RightPlayer.scoreMesh, this.LeftPlayer.scoreMesh );
        this.scene.add( this.LeftPlayer.paddle.mesh, this.RightPlayer.paddle.mesh );

        this.loop.updatables.push( this.ball );
        this.loop.updatables.push( this.LeftPlayer, this.RightPlayer, this.LeftPlayer.paddle, this.RightPlayer.paddle );
    }

    async initResultScreen() {
        if (this.birds != null)
            this.birdsWorld(false);
        if (this.samba != null) {
            if (this.settingsManager.coin === 1)
                this.sambaWorld(false, 'michelle');
            else
                this.sambaWorld(false, 'samba');
        }
        // if (this.obstacles != null) {
        //     for (let i = 0; i < this.obstacles.length; i++) {
        //         this.scene.remove(this.obstacles[i].mesh);
        //     }
        // }

        updateCameraResultScreen(this.camera);
        await new Promise((resolve) => setTimeout(resolve, 50));

        await this.resultManager.playerLeft.object.setLeftParticularities( this.scene );
        this.resultManager.playerLeft.object.addObject( this.scene , this.loop.updatables );

        await this.resultManager.playerRight.object.setRightParticularities( this.scene );
        this.resultManager.playerRight.object.addObject( this.scene , this.loop.updatables );
    }

    async initObstacles(number) {

        this.obstacles = [];
        for (let i = 0; i < number; i++) {
            const obstacle = new Obstacle();
            const object = await obstacle.initObstacle();
            this.obstacles[i] = object;
        }
        this.loop.obstacles = this.obstacles;
        for (let i = 0; i < number; i++) {
            this.scene.add(this.obstacles[i].mesh);
        }
    }

    async removeObstacles(number) {

        for (let i = 0; i < number; i++) {
            this.scene.remove(this.obstacles[i].mesh);
        }

        this.obstacles = null;
        this.loop.obstacles = null;
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    BIRDS    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    async birdsWorld(value) {
        if (value === true) {
            this.birds = new Birds();
            await this.birds.loadBirds();
            this.birds.addBirdsToScene(this.scene);
            this.birds.animateBirds(this.loop.updatables);
        } else {
            this.birds.removeBirdsFromScene(this.scene);
            this.birds.stopBirds(this.loop.updatables);
            this.birds = null;
        }
    }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    SAMBA    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    async sambaWorld(value, who) {
        if (value === true && who === 'samba') {
            this.samba = new Samba();
            await this.samba.loadSamba();
            this.samba.addSambaToScene(this.scene);
            this.samba.animateSamba(this.loop.updatables);
        }
        else if (value === true && who === 'michelle') {
            this.samba = new Michelle();
            await this.samba.loadMichelle();
            this.samba.addMichelleToScene(this.scene);
            this.samba.animateMichelle(this.loop.updatables);
        }
        else if (value === false && this.samba != null && who === 'samba') {
            this.samba.removeSambaFromScene(this.scene);
            this.samba.stopSamba(this.loop.updatables);
            this.samba = null;
        }
        else if (value === false && this.samba != null && who === 'michelle') {
            this.samba.removeMichelleFromScene(this.scene);
            this.samba.stopMichelle(this.loop.updatables);
            this.samba = null;
        }
    }

    render() {
        this.renderer.render( this.scene, this.camera );
    }

    start() {
        this.loop.start();
    }

    stop() {
        this.loop.stop();
    }
}

export { World };

/*
        const axesHelper = new THREE.AxesHelper(5000); // x: red, y: green, z: blue
        this.scene.add(axesHelper);

        const spotHelper = new THREE.SpotLightHelper(this.spotLightBall);
        const lightMarker = new THREE.Mesh( new THREE.SphereGeometry(10, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffff00 }) );
        lightMarker.position.copy(this.spotLightBall.position);
        this.scene.add(spotHelper, lightMarker);

*/
