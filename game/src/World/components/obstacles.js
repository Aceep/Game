import * as THREE from '../../../node_modules/three/build/three.module.js';
import { fieldWidth, fieldLength} from '../world.js';

class Obstacle {
    constructor () {
        this.obstacle = {};
        this.mesh       = null;
        this.color      = 0x000000;
    }

    getRandInt(min, max) {
        let nb = Math.floor(Math.random() * (max - min + 1)) + min;
        if ((nb) <= 10 && (nb) >= -10) {
            return nb + 20;
        }
        return nb;
    }

    async initObstacle() {
        const geometry = new THREE.BoxGeometry( 5, 5, 10 );
        const material = new THREE.MeshBasicMaterial( { color: 'white' } );

            const mesh = new THREE.Mesh( geometry, material );
            mesh.position.set( this.getRandInt(-fieldWidth/2, fieldWidth/2), this.getRandInt(-fieldLength/2, fieldLength/2), 5 );
            const object = {
                mesh: mesh,
                height: 5,
                width: 5,
            };

        return object;
    }
}

export { Obstacle };