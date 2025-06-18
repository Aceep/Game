import * as THREE from '../../../node_modules/three/build/three.module.js';

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.particleGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    }

    createParticles(position, color, count = 200) {
        for (let i = 0; i < count; i++) {
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 1,
            });
            const particle = new THREE.Mesh(this.particleGeometry, particleMaterial);

            particle.position.copy(position.clone());
            particle.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 250,
                (Math.random() - 0.5) * 250,
                (Math.random() - 0.5) * 250
            );

            particle.lifetime = 1.5;
            this.particles.push(particle);
            this.scene.add(particle);
        }
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.position.add(particle.velocity.clone().multiplyScalar(delta));
            particle.velocity.multiplyScalar(0.98);
            particle.lifetime -= delta;
            particle.material.opacity = Math.max(particle.lifetime, 0);

            if (particle.lifetime <= 0) {
                this.scene.remove(particle);
                this.particles.splice(i, 1);
            }
        }
    }
}

export { ParticleSystem };