export const modelsPath = {
    'Goleling': {
        path : 'ressources/game/Characters/Goleling.gltf',
        format : 'gltf',
        scale : 10,
    },
    'Princess': {
        path : 'ressources/game/Characters/princess/scene.gltf',
        format : 'gltf',
        scale : 18,
    },
    'Reindrix': {
        path : 'ressources/game/Characters/Reindrix/reindrix.fbx',
        format : 'fbx',
        scale : 0.1,
    },
    'Chillet' : {
        path : 'ressources/game/Characters/chillet/chillet2.gltf',
        format : 'gltf',
        scale : 10,
    },
    'Alpaking' : {
        path : 'ressources/game/Characters/Alpaking.gltf',
        format : 'gltf',
        scale : 10,
    },
    'Alien' : {
        path : 'ressources/game/Characters/Alien.gltf',
        format : 'gltf',
        scale : 10,
    },
    'Quivern' : {
        path : 'ressources/game/Characters/Quivern/Quivern.gltf',
        format : 'gltf',
        scale : 9,
    },
    'Depresso' : {
        path : 'ressources/game/Characters/Depresso/depresso.gltf',
        format : 'gltf',
        scale : 20,
    },
    'Frosti' : {
        path : 'ressources/game/Characters/Frosti/Frosti.gltf',
        format : 'gltf',
        scale : 9,
    },
    'Robot' : {
        path : 'ressources/game/Characters/Robot/robot.gltf',
        format : 'gltf',
        scale : 6,
    },
};

export const addings = {
    'Parrot': {
        path : 'ressources/game/customs/birds/Parrot.glb',
        format : 'glb',
        scale : 0.4,
        position : {x: 0, y: 0, z: 0, rotateX: Math.PI / 2, rotateY: Math.PI / 2},
        animation : 0,
    },
    'Flamingo': {
        path : 'ressources/game/customs/birds/Flamingo.glb',
        format : 'glb',
        scale : 0.4,
        position : {x: 0, y: 0, z: 0, rotateX: Math.PI / 2, rotateY: Math.PI / 2},
        animation : 0,
    },
    'Samba': {
        path : 'ressources/game/customs/samba/SambaDancing.fbx',
        format : 'fbx',
        scale : 0.2,
        position : {x: 0, y: 0, z: 0, rotateX: Math.PI / 2},
        animation : 0,
        config :
            `child.material.color.set('darkblue');
            child.material.emissive = new THREE.Color('white');
            child.material.emissiveIntensity = 0.2;`
    },
    'Michelle': {
        path : 'ressources/game/customs/samba/Michelle.glb',
        format : 'glb',
        scale : 0.2,
        position : {x: 0, y: 0, z: 0, rotateX: Math.PI / 2},
        animation : 0,
    },
};