import * as THREE from '../../../node_modules/three/build/three.module.js';
import { showStartScreen } from '../../utils.js';
import { LEFT, RIGHT, fieldLength, fieldWidth } from '../world.js';
import { updateCamera2D, updateCamera3D, updateOceanCamera } from '../components/camera.js';
import { ParticleSystem } from '../components/particles.js';
import { getRandomColor } from './randomColor.js';
import {FetchWithToken} from "../../../../js/modules/utility.js";
import { activateButtons, desactivateButtons } from '../../utils.js';

const clock = new THREE.Clock();
const ScoreMax = 5;

class Loop {
    constructor(ground, camera, scene, renderer, ball, LeftPlayer, RightPlayer, controls, settings, resultManager, pointLight, obstacles) {
        this.ball = ball;
        this.scene = scene;
        this.ground = ground;
        this.camera = camera;
        this.renderer = renderer;
        this.controls = controls;
        this.groundLight = pointLight;
        this.pathLight = ground.path;
        this.LeftPlayer = LeftPlayer;
        this.RightPlayer = RightPlayer;
        this.LeftScore = 0;
        this.RightScore = 0;
        this.LeftPaddle = LeftPlayer.paddle;
        this.RightPaddle = LeftPlayer.paddle;
        this.padLength = 0;
        this.updatables = [];
        this.startTime = Date.now();
        this.particleSystem = new ParticleSystem(scene);
        this.obstacles = obstacles;

        this.leftPaddleCollisionCount = 0;
        this.rightPaddleCollisionCount = 0;

        this.keyStates = {};
        this.gameStarted = false;

        this.settingsManager = settings;
        this.resultManager = resultManager;
        this.paddleSpeed = 100 + this.settingsManager.difficultyLevel;

        this.leftScore = document.getElementById('Left_Player')
        this.rightScore = document.getElementById('Right_Player');

        this.initEventHandlers();
    }


    initEventHandlers() {
        window.addEventListener("keyup", (event) => this.handleKeyUp(event));
        window.addEventListener("keydown", (event) => this.handleKeyDown(event));
        document.getElementById("reset_button").addEventListener("click", () => this.handleResetButton());
        document.getElementById("start_button").addEventListener("click", () => this.handleStartButton());
        document.getElementById("settingButton").addEventListener("click", () => this.settingsManager.handleSettingButton());

        document.getElementById("difficultyRange").addEventListener("input", () => this.settingsManager.handleDifficultyRange());

        document.getElementById("obstacleButtonAdd").addEventListener("click", () => this.settingsManager.handleObstacleButton("obstacleButtonAdd"));
        document.getElementById("obstacleButtonRemove").addEventListener("click", () => this.settingsManager.handleObstacleButton('obstacleButtonRemove'));
        document.getElementById("toogleButton").addEventListener("click", () => this.settingsManager.handlePersonalizationButton());

        document.getElementById("extraSmallPaddle").addEventListener("change", () => this.settingsManager.handlePaddleSize("extraSmall"));
        document.getElementById("smallPaddle").addEventListener("change", () => this.settingsManager.handlePaddleSize("small"));
        document.getElementById("mediumPaddle").addEventListener("change", () => this.settingsManager.handlePaddleSize("medium"));
        document.getElementById("largePaddle").addEventListener("change", () => this.settingsManager.handlePaddleSize("large"));
    }

    updateBall(newBall) {
        if (this.ball !== null) this.ball = newBall;
    }

    updateGroundLight(newGroundLight) {
        if (this.groundLight) {
            this.groundLight.children.forEach(child => {
                this.groundLight.remove(child);
            });
            this.scene.remove(this.groundLight);
        }
        if (newGroundLight) {
            this.groundLight = newGroundLight;
        } else {
            this.groundLight = null;
        }
    }

    updatePathLight(newPathLight) {
        if (newPathLight) {
            this.pathLight = newPathLight;
        } else {
            this.pathLight = null;
        }
    }

    updatePaddleSize(newPaddleSize) {
        this.LeftPaddle.length = newPaddleSize;
        this.RightPaddle.length = newPaddleSize;
        this.padLength = (this.LeftPaddle.length + 2 * this.LeftPaddle.radius);
    }

    updatePlayer(newPlayer, newPaddle, player) {
        if (player === LEFT) {
            if (newPlayer !== null) {
                this.LeftPlayer = newPlayer;
                this.LeftScore = newPlayer.scoreValue;
            }
            if (newPaddle !== null)
                this.LeftPaddle = newPaddle;
        } else if (player === RIGHT) {
            if (newPlayer !== null) {
                this.RightPlayer = newPlayer;
                this.RightScore = newPlayer.scoreValue;
            }
            if (newPaddle !== null)
                this.RightPaddle = newPaddle;
        }
        this.padLength = (this.LeftPaddle.length + 2 * this.LeftPaddle.radius);
    }

    handleResetButton() {
        if (this.settingsManager.theme === 'default') {
            updateCamera2D(this.camera);
        } else if (this.settingsManager.theme === 'ocean') {
            updateOceanCamera(this.camera);
        } else {
            updateCamera3D(this.camera);
        }
    }

    handleStartButton() {
        if (!this.gameStarted) {
            this.startGame();
            this.gameStarted = true;
        }
    }

    handleKeyDown(event) {
        this.keyStates[event.key] = true;

        if (event.key === ' ' && !this.gameStarted) {
            event.preventDefault();
            this.startGame();
            this.gameStarted = true;
        } else if (event.key === 'r' || event.key === 'R') {
            this.controls.reset();
        }
    }

    handleKeyUp(event) {
        this.keyStates[event.key] = false;
    }

    update(delta) {
        const paddleMovementSpeed = this.paddleSpeed * delta;

        if (this.keyStates['w'] && this.LeftPaddle.mesh.position.y < fieldLength / 2 - this.padLength / 2) {
            this.LeftPaddle.mesh.position.y += paddleMovementSpeed;
        }

        if (this.keyStates['s'] && this.LeftPaddle.mesh.position.y > -fieldLength / 2 + this.padLength / 2) {
            this.LeftPaddle.mesh.position.y -= paddleMovementSpeed;
        }

        if (this.keyStates['o'] && this.RightPaddle.mesh.position.y < fieldLength / 2 - this.padLength / 2) {
            this.RightPaddle.mesh.position.y += paddleMovementSpeed;
        }

        if (this.keyStates['l'] && this.RightPaddle.mesh.position.y > -fieldLength / 2 + this.padLength / 2) {
            this.RightPaddle.mesh.position.y -= paddleMovementSpeed;
        }

        this.leftScore.textContent = this.LeftScore;
        this.rightScore.textContent = this.RightScore;
    }

    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick();
            this.renderer.render(this.scene, this.camera);
        });
    }

    stop() {
        this.renderer.setAnimationLoop(null);
    }

    tick() {
        const delta = clock.getDelta();
        const time = Date.now() * 0.0005;

        for (const object of this.updatables) {
            if (object.tick)
                object.tick(delta);
        }

        this.ballPhysics();
        this.update(delta);
        this.particleSystem.update(delta);
    }

    async startGame() {
        desactivateButtons(this);
        document.removeEventListener("keydown", this.handleKeyDown);
        this.resultManager.initResultCharacters();
        await showStartScreen();
        this.ball.start();
        this.gameStarted = true;
        this.toggleScrolling(false);
    }

    async endGame() {
        try {

            var headers = new Headers()
            headers.append("Content-Type", "application/json");
            // headers.append('X-CSRFToken', csrftoken);

            const jsonData = {
                p1_score: this.LeftScore,
                p2_score: this.RightScore
            }

            const response = await FetchWithToken("https://localhost:4241/game/results", {
                method: "POST",
                body: JSON.stringify(jsonData),
                headers: headers,
                credentials: 'include',
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);
        }
        catch (error) {
            console.error(`ERROR: ${error}`);
        }
        this.resultManager.setResults();

        this.LeftScore = 0;
        this.RightScore = 0;
        this.ball.ballSpeed = 0;
        this.paddleSpeed = 100 + this.settingsManager.difficultyLevel;
        this.ball.mesh.position.setX(0);
        this.ball.mesh.position.setY(0);
        this.leftPaddleCollisionCount = 0;
        this.rightPaddleCollisionCount = 0;
        this.LeftPaddle.mesh.position.setY(0);
        this.RightPaddle.mesh.position.setY(0);
        this.LeftPlayer.resetScore();
        this.RightPlayer.resetScore();
        this.toggleScrolling(true);
    }

    check_victory() {
        if (this.LeftScore == ScoreMax || this.RightScore == ScoreMax) {
            console.log("Game stats: ");
            console.log("Hit count L-R:", this.leftPaddleCollisionCount, '-', this.rightPaddleCollisionCount);
            console.log('Score', this.LeftScore, '-', this.RightScore);
            console.log('Game duration', (Date.now() - this.startTime) / 1000, 's');
            console.log('Chosen theme', this.settingsManager.theme);
            console.log('Difficulty level :', this.ball.ballSpeedRange / 20);
            console.log('Paddle size', this.LeftPaddle.length, 'default is 40');
            this.endGame();
            this.leftScore.textContent = this.LeftScore;
            this.rightScore.textContent = this.RightScore;
        }
    }

    async resetBall(winner) {
        this.ball.mesh.position.x = 0;
        this.ball.mesh.position.y = 0;

        if (winner == LEFT) {
            this.ball.ballAngle = Math.PI;
            this.LeftScore++;
            await this.LeftPlayer.updateScore(this.LeftScore);
        } else if (winner == RIGHT) {
            this.ball.ballAngle = 0;
            this.RightScore++;
            await this.RightPlayer.updateScore(this.RightScore);
        }
    }

    checkPaddleCollision() {
        const randomColor = getRandomColor();

        if (this.ball.mesh.position.x <= - fieldWidth / 2 + this.LeftPaddle.radius / 2
            && this.ball.mesh.position.y >= this.LeftPaddle.mesh.position.y - this.LeftPaddle.length / 1.8
            && this.ball.mesh.position.y <= this.LeftPaddle.mesh.position.y + this.LeftPaddle.length / 1.8)
            {
                this.ball.mesh.position.x = this.LeftPaddle.mesh.position.x + this.LeftPaddle.radius / 2;
                this.ball.ballAngle = Math.random() * Math.PI / 4;
                this.ball.ballSpeed = - this.ball.ballSpeed;
                this.leftPaddleCollisionCount++;
                if (this.settingsManager.theme === 'neon') {
                    this.ball.ballMaterial.color.set(randomColor);
                    this.ball.ballMaterial.emissive.set(randomColor);
                    this.particleSystem.createParticles(this.ball.mesh.position, 0xFF3333);
                }
            }

        if (this.ball.mesh.position.x >= fieldWidth / 2 - this.RightPaddle.radius / 2
            && this.ball.mesh.position.y >= this.RightPaddle.mesh.position.y - this.RightPaddle.length / 1.8
            && this.ball.mesh.position.y <= this.RightPaddle.mesh.position.y + this.RightPaddle.length / 1.8)
            {
                this.ball.mesh.position.x = this.RightPaddle.mesh.position.x - this.RightPaddle.radius / 2;
                this.ball.ballAngle = - Math.random() * Math.PI / 4;
                this.ball.ballSpeed = - this.ball.ballSpeed;
                this.rightPaddleCollisionCount++;
                if (this.settingsManager.theme === 'neon') {
                    this.ball.ballMaterial.color.set(randomColor);
                    this.ball.ballMaterial.emissive.set(randomColor);
                    this.particleSystem.createParticles(this.ball.mesh.position, 0x3399FF);
                }
            }
            // console.log("left count", this.leftPaddleCollisionCount, 'right count', this.rightPaddleCollisionCount);
    }

    checkWallCollision() {
        const randomColor = getRandomColor();
        if ((this.ball.mesh.position.y <= -(fieldLength / 2 - this.ball.radius))
            || (this.ball.mesh.position.y >= (fieldLength / 2 - this.ball.radius))) {
            this.ball.ballAngle = - this.ball.ballAngle;
            if (this.settingsManager.theme === 'neon') {
                this.ball.ballMaterial.color.set(randomColor);
                this.ball.ballMaterial.emissive.set(randomColor);
                this.particleSystem.createParticles(this.ball.mesh.position, randomColor);
            }
        }

        if (this.ball.mesh.position.x >= fieldWidth / 2 - this.RightPaddle.depth + this.ball.radius) {
            this.ball.ballSpeed = - this.ball.ballSpeed;
            this.resetBall(RIGHT);
        }

        if (this.ball.mesh.position.x <= - fieldWidth / 2 + this.LeftPaddle.depth - this.ball.radius) {
            this.ball.ballSpeed = - this.ball.ballSpeed;
            this.resetBall(LEFT);
        }
    }

    checkObstaclesCollision() {
        const randomColor = getRandomColor();
        this.obstacles.forEach(obstacle => {
            if (this.ball.mesh.position.x >= obstacle.mesh.position.x - obstacle.width / 2 - this.ball.radius
                && this.ball.mesh.position.x <= obstacle.mesh.position.x + obstacle.width / 2 + this.ball.radius
                && this.ball.mesh.position.y >= obstacle.mesh.position.y - obstacle.height / 2 - this.ball.radius
                && this.ball.mesh.position.y <= obstacle.mesh.position.y + obstacle.height / 2 + this.ball.radius) {
                this.ball.ballAngle = - Math.random() * Math.PI / 4;
                this.ball.ballSpeed = - this.ball.ballSpeed;
                if (this.settingsManager.theme === 'neon') {
                    this.ball.ballMaterial.color.set(randomColor);
                    this.ball.ballMaterial.emissive.set(randomColor);
                    this.particleSystem.createParticles(this.ball.mesh.position, randomColor);
                }
            }
        }); 
    }

    ballPhysics() {
        this.checkPaddleCollision();
        this.checkWallCollision();
        if (this.obstacles) this.checkObstaclesCollision();
        this.check_victory();
    }

    toggleScrolling(enable) {
        document.body.style.overflow = enable ? '' : 'hidden';
    }
}

export { Loop };
/*
        if (this.groundLight && this.groundLight instanceof THREE.PointLight && this.pathLight) {
            const percentage = (time * 0.0005) % 1;
            const position = this.pathLight.getPointAt(percentage);
            this.groundLight.position.set(position.x, position.y, position.z);
        }
*/
