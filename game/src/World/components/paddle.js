import * as THREE from '../../../node_modules/three/build/three.module.js';
import { fieldWidth, LEFT, RIGHT, depth} from '../world.js';

const PADDLE_CONFIG = {
    depth: 5,
    radius: 4,
    length: 40,
    radialSegments: 64 * 2
};

class Paddle {
    constructor (color, playerID) {
        this.mesh       = null;
        this.color      = color;
        this.playerID   = playerID;
        this.depth      = PADDLE_CONFIG.depth;
        this.radius     = PADDLE_CONFIG.radius;
        this.length     = PADDLE_CONFIG.length;
        this.radialSegments = PADDLE_CONFIG.radialSegments;
    }

    createPaddleGeometry(type) {
        if (type === 'box') {
            return new THREE.BoxGeometry(this.radius, this.length, this.depth, this.radialSegments, this.radialSegments);
        } else if (type === 'capsule') {
            return new THREE.CapsuleGeometry(this.radius, this.length, this.depth, this.radialSegments, this.radialSegments);
        } else if (type === 'halo') {
            return new THREE.CapsuleGeometry(this.radius + 0.5, this.length + 0.5, this.depth + 0.5, this.radialSegments, this.radialSegments);
        }
    }

    createPaddleMaterial(type) {
        if (type === 'basic') {
            return new THREE.MeshBasicMaterial({ color: this.color });
        } else if (type === 'standard') {
            return new THREE.MeshStandardMaterial({
                color: this.color,
                roughness: 0.1,
                metalness: 0.9,
            });
        } else if (type === 'halo') {
            return new THREE.MeshBasicMaterial({
                color: 'white',
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.3
            });
        }
    }

    positionPaddle() {
        this.mesh.position.z = depth;
        if (this.playerID === LEFT) {
            this.mesh.position.x = - fieldWidth / 2;
        } else if (this.playerID === RIGHT) {
            this.mesh.position.x = fieldWidth / 2;
        }
    }

    loadDefaultPaddle() {
        const paddleGeometry = this.createPaddleGeometry('box');
        const paddleMaterial = this.createPaddleMaterial('basic');

        this.mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.positionPaddle();

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.needsUpdate = true;
    }

    loadThemePaddle() {
        const paddleGeometry = this.createPaddleGeometry('capsule');
        const paddleMaterial = this.createPaddleMaterial('standard');
        this.mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
        this.positionPaddle();

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.needsUpdate = true;
    }

    loadNeonPaddle() {
        const paddleGeometry = this.createPaddleGeometry('capsule');
        const paddleMaterial = this.createPaddleMaterial('basic');
        this.mesh = new THREE.Mesh(paddleGeometry, paddleMaterial);

        const haloGeometry = this.createPaddleGeometry('halo');
        const haloMaterial = this.createPaddleMaterial('halo');
        const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
        haloMesh.position.copy(this.mesh.position.clone());
        this.mesh.add(haloMesh);

        this.positionPaddle();
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.needsUpdate = true;
        console.log('Neon Paddle', this.mesh);
    }

    switchPaddle(world, theme) {
        if (this.mesh) {
            world.scene.remove(this.mesh);
            this.mesh = null;
        }

        world.paddle = new Paddle(this.color, this.playerID);
        switch (theme) {
            case 'default':
                this.loadDefaultPaddle();
                break;
            case 'foot':
            case 'ocean':
                this.loadThemePaddle();
                break;
            case 'neon':
                this.loadNeonPaddle();
                break;
        }
        world.scene.add(this.mesh);
    }

    changePaddleSize(newPaddleSize) {
        this.length = newPaddleSize;
        this.mesh.scale.y = newPaddleSize / PADDLE_CONFIG.length;
    }

    tick(delta) {}
}

export { Paddle };
