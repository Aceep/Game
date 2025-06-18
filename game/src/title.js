import * as THREE from '../node_modules/three/build/three.module.js';
import { waitForElement } from './utils.js';

// Settings
const string = "3D PONG";
const fontName = "Arial";
const textureFontSize = 30;
const fontScaleFactor = 0.2;
const colors = ['#F7A541', '#F45D4C', '#FA2E59', '#4783c3', '#9c6cb7'];

let textureCoordinates = [],particles = [];
let scene, camera, renderer, textCanvas, textCtx, particleGeometry, instancedMesh;

let stringBox = {
    wTexture: 0,
    hTexture: 0,
    wScene: 0,
    hScene: 0,
};

async function initScene() {
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const container = await waitForElement("#titleGame");
    container.appendChild(renderer.domElement);

    textCanvas = document.createElement("canvas");
    textCanvas.width = textCanvas.height = 0;
    textCtx = textCanvas.getContext("2d");

    /*      Particle geometry     */
    const shape = new THREE.Shape();
    const radius = 0.15;

    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, 0.2 * Math.PI, 1.8 * Math.PI, false);
    shape.lineTo(0, 0);
    shape.closePath();

    particleGeometry = new THREE.ShapeGeometry(shape);
    // particleGeometry = new THREE.SphereGeometry(0.5, 64, 64);

    const shadowLight = new THREE.DirectionalLight( 0xffffff, 3);
    shadowLight.castShadow = true;
    shadowLight.position.set(1, 0, 2);
    shadowLight.shadowDarkness = 0.01;
    shadowLight.target.position.set(0, 10, 0);
    scene.add(shadowLight);

    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set(-1, 0, 2);
    light.castShadow = true;
    light.target.position.set(0, 10, 0);
    scene.add(light);

    const backLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    backLight.position.set(0, 0, -2);
    backLight.castShadow = true;
    backLight.target.position.set(0, 10, 0);
    scene.add(backLight);
}

function createEvents() {
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function render() {
    requestAnimationFrame(render);
    updateParticlesMatrices();
    renderer.render(scene, camera);
}

function refreshText() {
    sampleCoordinates();
    particles = textureCoordinates.map(
        (c) => new Particle([c.x * fontScaleFactor, c.y * fontScaleFactor])
    );
    recreateInstancedMesh();
    makeTextFitScreen();
}

function sampleCoordinates() {
    stringBox.wTexture = textureFontSize * 0.7 * string.length;
    stringBox.hTexture = string.length * textureFontSize;
    stringBox.wScene = stringBox.wTexture * fontScaleFactor;
    stringBox.hScene = stringBox.hTexture * fontScaleFactor;

    textCanvas.width = stringBox.wTexture;
    textCanvas.height = stringBox.hTexture;
    textCtx.font = "700 " + textureFontSize + "px " + fontName;
    textCtx.fillStyle = "#2a9d8f";
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    textCtx.fillText(string, 0, 0.8 * stringBox.hTexture);

    textureCoordinates = [];
    if (stringBox.wTexture > 0) {
        const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
        for (let i = 0; i < textCanvas.height; i++) {
            for (let j = 0; j < textCanvas.width; j++) {
                if (imageData.data[(j + i * textCanvas.width) * 4] > 0) {
                    textureCoordinates.push({ x: j, y: i });
                }
            }
        }
    }
}

function Particle([x, y]) {
    this.x = x;
    this.y = y;
    this.z = 0;
    this.rotationX = Math.random() * 1 * Math.PI;
    this.rotationY = Math.random() * 1 * Math.PI;
    this.rotationZ = Math.random() * 1 * Math.PI;
    this.scale = 0;

    this.deltaRotation = 0.05 * (Math.random() - 0.5);
    this.deltaScale = 0.01 + 0.2 * Math.random();
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.particleMaterial = new THREE.MeshStandardMaterial({
        color: this.color,
        roughness: 0.4,
        metalness: 0.5,
    })

    this.mesh = new THREE.Mesh(particleGeometry, this.particleMaterial);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.grow = function () {
        this.rotationX += this.deltaRotation;
        this.rotationY += this.deltaRotation;
        this.rotationZ += this.deltaRotation;

        if (this.scale < 1) {
            this.scale += this.deltaScale;
        }
    };
}

function recreateInstancedMesh() {
    scene.remove(instancedMesh);
    instancedMesh = new THREE.Group();

    particles.forEach((p) => {
        instancedMesh.add(p.mesh);
    });

    scene.add(instancedMesh);
    instancedMesh.position.x = -0.5 * stringBox.wScene;
}

function updateParticlesMatrices() {
    particles.forEach((p) => {
        p.grow();
        p.mesh.position.set(p.x, stringBox.hScene - p.y, p.z);
        p.mesh.rotation.set(p.rotationX, p.rotationY, p.rotationZ);
        p.mesh.scale.set(p.scale, p.scale, p.scale);
    });
}

function makeTextFitScreen() {
    const fov = camera.fov * (Math.PI / 180);
    const fovH = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const dx = Math.abs((0.32 * stringBox.wScene) / Math.tan(0.5 * fovH));
    const dy = Math.abs((0.32 * stringBox.hScene) / Math.tan(0.5 * fov));
    const factor = Math.max(dx, dy) / camera.position.length();
    if (factor > 1) {
      camera.position.x *= factor;
      camera.position.y *= factor;
      camera.position.z *= factor;
    }
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await initScene();
    createEvents();
    refreshText();
    render();
});

/*
    particleGeometry = new THREE.TorusGeometry(0.1, 0.05, 32, 50);
    particleGeometry = new THREE.TorusKnotGeometry(0.1, 0.05, 32, 50);

pac man
    const shape = new THREE.Shape();
    const radius = 0.2;
    shape.moveTo(0, 0);
    shape.arc(0, 0, radius, 0.2 * Math.PI, 1.8 * Math.PI, false);
    shape.lineTo(0, 0);
    shape.closePath();
    particleGeometry = new THREE.ShapeGeometry(shape);

star
    const shape = new THREE.Shape();
    const outerRadius = 0.5;
    const innerRadius = 0.15;
    const spikes = 5;
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i / (spikes * 2)) * Math.PI * 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) {
            shape.moveTo(x, y);
        } else {
            shape.lineTo(x, y);
        }
    }
    shape.closePath();
    particleGeometry = new THREE.ShapeGeometry(shape);

heart
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    
    particleGeometry = new THREE.ShapeGeometry(shape);
    particleGeometry.scale(0.15, 0.15, 0.15);

*/