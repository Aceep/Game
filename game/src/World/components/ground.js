import * as THREE from '../../../node_modules/three/build/three.module.js';
import { MTLLoader } from '../../../node_modules/three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../../../node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { fieldLength, fieldWidth, depth } from '../world.js';

class Ground {
    constructor(width, height, depth) {
        this.path = null;
        this.mesh   = null;
        this.depth = depth;
        this.width  = width;
        this.height = height;
        this.pointLight = null;
    }

    async loadDefaultGround() {
        console.log("Loading Pong ground");
        this._removeMesh();

        const groundGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const groundMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        this.mesh = new THREE.Mesh(groundGeometry, groundMaterial);

        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0xffffff,
            linewidth: 10,
            dashSize: 8,
            gapSize: 8,
        });

        const startPoint = new THREE.Vector3(0, -this.height / 2, depth);
        const endPoint = new THREE.Vector3(0, this.height / 2, depth);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.computeLineDistances();
        this.mesh.add(line);
    }

    async loadFootballGround() {
        console.log("Loading Foot ground");
        this._removeMesh();

        const loader = new OBJLoader();
        const mltloader = new MTLLoader();
        const textureLoader = new THREE.TextureLoader();

        const mtlData = await mltloader.loadAsync('../../ressources/game/Foot_Theme/Grass.mtl');
        loader.setMaterials(mtlData);

        const groundData = await loader.loadAsync('../../ressources/game/Foot_Theme/Grass.obj');
        const groundGeometry = groundData.children[0].geometry;
        const groundMaterial = groundData.children[0].material;
        groundMaterial.shininess = 50;
        groundMaterial.specular = new THREE.Color('green');

        groundGeometry.computeBoundingBox();
        const bbox = groundGeometry.boundingBox;
        const size = bbox.getSize(new THREE.Vector3());

        const grassTexture = await textureLoader.loadAsync('../../ressources/game/Foot_Theme/footballField.jpg');

        this.mesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.mesh.map = grassTexture;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.scale.set(this.height / size.x, - 2, this.width / size.z);
        this.mesh.rotation.set(Math.PI / 2, Math.PI / 2, 0);
        this.mesh.needsUpdate = true;
    }

    async loadOceanGround() {
        console.log("Loading ocean ground");
        this._removeMesh();

        const loader = new OBJLoader();
        const mltloader = new MTLLoader();
        const textureLoader = new THREE.TextureLoader();

        const mtlData = await mltloader.loadAsync('../../ressources/game/Ocean_Theme/islandTheme.mtl');
        loader.setMaterials(mtlData);

        const groundData = await loader.loadAsync('../../ressources/game/Ocean_Theme/islandTheme.obj');

        const islandGroup = new THREE.Group();
        groundData.children.forEach(child => {
            const mesh = new THREE.Mesh(child.geometry, child.material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            islandGroup.add(mesh);
        });
        islandGroup.rotateX(Math.PI / 2);
        islandGroup.scale.set(100, 100, 100);
        islandGroup.position.z = - 4;

        const textures = await Promise.all([
            textureLoader.loadAsync('../../ressources/game/Ocean_Theme/Water_Rough.jpg'),
            textureLoader.loadAsync('../../ressources/game/Ocean_Theme/Water_Occ.jpg'),
            textureLoader.loadAsync('../../ressources/game/Ocean_Theme/Water_Norm.jpg'),
            textureLoader.loadAsync('../../ressources/game/Ocean_Theme/Water_Disp.png'),
            textureLoader.loadAsync('../../ressources/game/Ocean_Theme/Water_Color.jpg')
        ]);
        const [roughnessMap, aoMap, normalMap, displacementMap, colorMap] = textures;

        const oceanMaterial = new THREE.MeshStandardMaterial({
            map: colorMap,
            normalMap: normalMap,
            displacementMap: displacementMap,
            aoMap: aoMap,
            roughnessMap: roughnessMap,
        });
        const worldRadius = 50000;
        const oceanGeometry = new THREE.SphereGeometry(worldRadius, 512, 512);
        const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
        ocean.position.z = - worldRadius - 4;

        const repeat = 1000;
        textures.forEach(map => {
            map.wrapS = map.wrapT = THREE.RepeatWrapping;
            map.repeat.set(repeat, repeat);
        });

        this.mesh = new THREE.Group();
        this.mesh.add(islandGroup);
        this.mesh.add(ocean);

        this.mesh.traverse((node) => {
            if (node.isMesh || node.isGroup) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
    }

    async loadNeonGround(scene) {
        console.log("Loading Neon ground");
        this._removeMesh();

        const textureLoader = new THREE.TextureLoader();
        const neonTexture = await textureLoader.loadAsync('../../ressources/game/Neon_Theme/groundNeon_bicolor.png');

        const groundGeometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        const groundMaterial = new THREE.MeshStandardMaterial({
            map: neonTexture,
            metalness: 0.9,
            emissive: 'white',
            emissiveIntensity: 0.9,
            emissiveMap: neonTexture,
        });

        this.mesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.position.z = - depth / 2;
        this.mesh.needsUpdate = true;
    }

    async switchGround(world, version) {
        if (this.mesh) {
            world.scene.remove(world.ground.mesh);
            this.mesh = null;
        }

        world.ground = new Ground(fieldWidth, fieldLength, depth);
        switch (version) {
            case 'foot':
                await world.ground.loadFootballGround();
                break;
            case 'ocean':
                await world.ground.loadOceanGround();
                break;
            case 'neon':
                await world.ground.loadNeonGround(world.scene);
                break;
            case 'default':
            default:
                await world.ground.loadDefaultGround();
                break;
        }

        world.scene.add(world.ground.mesh);
    }

    _removeMesh() {
        if (this.mesh) {
            this.mesh.parent.remove(this.mesh);
            this.mesh = null;
        }
    }
}

export { Ground };

/*
        const sphere = new THREE.SphereGeometry( 1, 16, 8 );
        this.pointLight  = new THREE.PointLight( 0xffffff, 10 );
        this.pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }) ) );
        this.pointLight.castShadow = true;
        scene.add(this.pointLight);

        const cornersLight = [
            new THREE.Vector3(-this.width / 2, this.height / 2, depth ),
            new THREE.Vector3( this.width / 2, this.height / 2, depth ),
            new THREE.Vector3( this.width / 2, -this.height / 2, depth ),
            new THREE.Vector3(-this.width / 2, -this.height / 2, depth ),
        ];

        this.path = new THREE.CatmullRomCurve3(cornersLight);
        this.path.closed = true;
        this.path.tension = 0.01;
        this.path.curveType = 'catmullrom';
*/
