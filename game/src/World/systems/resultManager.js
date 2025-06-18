import { GLTFObject , FBXObject } from "../components/animation.js";
import { updateCamera2D, updateCamera3D } from "../components/camera.js";
import { showFadingScreen, hideFadingScreen, activateButtons } from "../../utils.js";
import { modelsPath } from "../../dataModels.js";

class ResultManager {
    constructor(world) {
        this.world = world;
        this.playerLeft = {
            name: null,
            object: null,
        };
        this.playerRight = {
            name: null,
            object: null,
        };
    }
    
    async initResultCharacters() {
        if (this.playerLeft.name === null || this.playerRight.name === null) return;

        if ( modelsPath[this.playerLeft.name].format === 'gltf' && this.playerLeft.object === null ) {
            this.playerLeft.object = new GLTFObject();
            await this.playerLeft.object.loadGLTFObject(this.playerLeft.name); 
        }
        else if (modelsPath[this.playerLeft.name].format === 'fbx' && this.playerLeft.object === null ) {
            this.playerLeft.object = new FBXObject();
            await this.playerLeft.object.loadFBXObject(this.playerLeft.name);
        }
        if ( modelsPath[this.playerRight.name].format === 'gltf' && this.playerRight.object === null ) {
            this.playerRight.object = new GLTFObject();
            await this.playerRight.object.loadGLTFObject(this.playerRight.name);
        }
        else if (modelsPath[this.playerRight.name].format === 'fbx' && this.playerRight.object === null ) {
            this.playerRight.object = new FBXObject();
            await this.playerRight.object.loadFBXObject(this.playerRight.name);
        }
    }

    async endGame() {
        return new Promise(async (resolve) => {
    
        // Show fading screen
        await showFadingScreen();

        // Hide fading screen after some time
        setTimeout(async () => {
            await hideFadingScreen();
        }, 500); // Show result screen for 3 seconds before fading out
        resolve();    
        });
    }

    async setResults() {
        if (this.playerLeft.object === null || this.playerRight.object === null) return activateButtons(this.world.loop);
        await this.endGame();

        this.world.initResultScreen();

        await new Promise((resolve) => setTimeout(resolve, 5000));
        this.removeResults();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // if (this.world.obstacles) {
        // for (let i = 0; i < this.world.obstacles.length; i++) {
        //     this.world.scene.add(this.world.obstacles[i].mesh);
        // }
        // }
        if (this.world.settingsManager.theme === 'default')
            updateCamera2D(this.world.camera);
        else
            updateCamera3D(this.world.camera);

        await new Promise((resolve) => setTimeout(resolve, 3000));
        activateButtons(this.world.loop);
    }

    async removeResults() {
        if (this.playerLeft.object === null || this.playerRight.object === null) return;

        await this.endGame();

        this.playerLeft.object.removeObject(this.world.scene, this.world.loop.updatables);
        this.playerRight.object.removeObject(this.world.scene, this.world.loop.updatables);
        this.playerLeft.object = null;
        this.playerRight.object = null;
        
        // set back the personnalisations
        if (document.getElementById("SwitchCheckBirdsTheme").checked)
            this.world.birdsWorld(true);
        if (document.getElementById("SwitchCheckSambaTheme").checked) {
            if (this.world.settingsManager.coin === 1)
                this.world.sambaWorld(true, 'michelle');
            else
                this.world.sambaWorld(true, 'samba');
        }
    }
}

export { ResultManager };
