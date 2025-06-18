import { toggleLeftOffcanvas , toggleRightOffcanvas } from '../../utils.js';

class SettingsManager {
    constructor(world) {
        this.world = world;
        this.ball = null;
        this.theme = 'default';
        this.coin = -1;
        this.difficultyLevel = 1;
        this.obstacles = false;
        this.count = 3;
} 

    handleObstacleButton(button) {
        if (this.obstacles === false && button === "obstacleButtonAdd")
        {
            this.obstacles = true;
            console.log(document.getElementById("obstacleInput").value);
            if (document.getElementById("obstacleInput").value != "")
            {
                if (parseInt(document.getElementById("obstacleInput").value) >= 1 && parseInt(document.getElementById("obstacleInput").value) <= 10)
                    this.count = parseInt(document.getElementById("obstacleInput").value);
                else
                    alert("Please enter a number between 1 and 10 or leave blank for default value (3)");
            }
            this.world.initObstacles(this.count);
            document.getElementById("obstacleInput").disabled = true;
            document.getElementById("obstacleButtonAdd").title = "Please remove the obstacles first";
        }
        else if (this.obstacles === true && button === "obstacleButtonRemove")
        {
            this.obstacles = false;
            this.world.removeObstacles(this.count);
            document.getElementById("obstacleInput").disabled = false;
            document.getElementById("obstacleButtonAdd").title = "Add Obstacles";
        }
    }

    handlePersonalizationButton() {

        toggleLeftOffcanvas();

        // Ensure that event listeners are not attached multiple times
        const saveButton = document.getElementById("save_button2");
        const closeButton = document.getElementById("close_button2");
        const resetButton = document.getElementById("reset_button2");

        // Remove existing event listeners if any
        saveButton.removeEventListener("click", this.handleSaveButtonClick);
        closeButton.removeEventListener("click", this.handleCloseButtonClick);
        resetButton.removeEventListener("click", this.handleResetButtonClick);

        // Define event listener functions
        this.handleSaveButtonClick = async (event) => {
            event.stopImmediatePropagation();
            const leftAvatar = document.querySelector('#carousel1 .carousel-item.active img');
            const rightAvatar = document.querySelector('#carousel2 .carousel-item.active img');
            const activeImgAlt1 = leftAvatar ? leftAvatar.alt : 'No active image in carousel 1';
            const activeImgAlt2 = rightAvatar ? rightAvatar.alt : 'No active image in carousel 2';
            this.world.resultManager.playerLeft.name = activeImgAlt1;
            this.world.resultManager.playerRight.name = activeImgAlt2;
            console.log('Left player:', this.world.resultManager.playerLeft.name);
            console.log('Right player:', this.world.resultManager.playerRight.name);
            document.getElementById("offcanvasLeft").classList.replace("show", "hidden");
        };

        this.handleCloseButtonClick = async (event) => {
            event.stopImmediatePropagation();
            document.getElementById("offcanvasLeft").classList.add("hidden");
        };

        this.handleResetButtonClick = async (event) => {
            event.stopImmediatePropagation();
            this.world.resultManager.playerLeft.name = null;
            this.world.resultManager.playerRight.name = null;
            this.world.resultManager.playerLeft.object = null;
            this.world.resultManager.playerRight.object = null;
            document.getElementById("offcanvasLeft").classList.replace("show", "hidden");
        };

        // Attach event listeners
        saveButton.addEventListener("click", this.handleSaveButtonClick);
        closeButton.addEventListener("click", this.handleCloseButtonClick);
        resetButton.addEventListener("click", this.handleResetButtonClick);
    }


    handleSettingButton() {
    let modal = document.getElementById("settingModal");

    this.switchPanelSaver();
    
    document.getElementById("save_button").addEventListener("click", async () => {
        event.stopImmediatePropagation();
        this.add_custom_settings();
    });

    modal.addEventListener('hidden.bs.modal', () => this.restoreSettings());

    modal.querySelectorAll('.form-check-input').forEach(function(switchElement) {
        switchElement.addEventListener('change', function() {
            var relatedSwitchId = this.getAttribute('data-related');
            var SwitchId = this.getAttribute('id');
            if (this.checked) {
                document.querySelectorAll('.form-check-input').forEach(function(switchElement) {
                    if (switchElement.getAttribute('data-related') == relatedSwitchId && SwitchId != switchElement.getAttribute('id')) {
                        switchElement.checked = false;
                    }
                });
            }
        });
    });

    }

    restoreSettings() {
        document.getElementById("SwitchCheckBirdsTheme").checked = this.settingPanel.switch1;
        document.getElementById("SwitchCheckOceanTheme").checked = this.settingPanel.switch2;
        document.getElementById("SwitchCheckFootTheme").checked = this.settingPanel.switch3;
        document.getElementById("SwitchCheckNeonTheme").checked = this.settingPanel.switch4;
        document.getElementById("SwitchCheckSambaTheme").checked = this.settingPanel.switch5;
        document.getElementById("SwitchCheckPongTheme").checked = this.settingPanel.switch6;
    }

    switchPanelSaver() {
        this.settingPanel = {
            switch1: document.getElementById("SwitchCheckBirdsTheme").checked,
            switch2: document.getElementById("SwitchCheckOceanTheme").checked,
            switch3: document.getElementById("SwitchCheckFootTheme").checked,
            switch4: document.getElementById("SwitchCheckNeonTheme").checked,
            switch5: document.getElementById("SwitchCheckSambaTheme").checked,
            switch6: document.getElementById("SwitchCheckPongTheme").checked,
        }
    }

    toogleOffcanvas() {
        var leftOffcanvas = document.getElementById('offcanvasLeft');
        
        var leftOffcanvasInstance = new bootstrap.Offcanvas(leftOffcanvas);
        
        leftOffcanvasInstance.toggle();
    }

    handleDifficultyRange() {
        const difficulty = document.getElementById("difficultyRange").value;

        this.world.ball.ballSpeedRange = difficulty * 20;
        this.difficultyLevel = difficulty * 20;

        if (this.world.loop.gameStarted === false) this.world.loop.paddleSpeed = 100 + this.difficultyLevel;
    }

    handlePaddleSize(size) {
        let newPaddleSize;

        switch(size) {
            case "extraSmall":
                newPaddleSize = 20;
                break;
            case "small":
                newPaddleSize = 30;
                break;
            case "medium":
                newPaddleSize = 40;
                break;
            case "large":
                newPaddleSize = 60;
                break;
            default:
                newPaddleSize = 40;
        }
        this.world.LeftPlayer.paddle.changePaddleSize(newPaddleSize);
        this.world.RightPlayer.paddle.changePaddleSize(newPaddleSize);
        this.world.loop.updatePaddleSize(newPaddleSize);
    }

    async DefaultTheme() {
        await this.world.initDefaultWorld();
        this.theme = 'default';
    }

    async initSamba(sambaTheme) {
        if (this.coin == -1) {
            this.coin = Math.floor(Math.random() * 2);
        }

        if (sambaTheme && this.settingPanel.switch5 != sambaTheme) {
            if (this.coin == 0)
                this.world.sambaWorld(true, 'samba');
            else
                this.world.sambaWorld(true, 'michelle');
        } else if (!sambaTheme && this.settingPanel.switch5 == true) {
            if (this.coin == 0)
                this.world.sambaWorld(false, 'samba');
            else
                this.world.sambaWorld(false, 'michelle');
            this.coin = -1;
        }
    }

    async BirdsTheme(birdsTheme) {
        if (birdsTheme && this.settingPanel.switch1 != birdsTheme) {
            await this.world.birdsWorld(true);
        } else if (!birdsTheme && this.settingPanel.switch1 != birdsTheme){
            await this.world.birdsWorld(false);
        }
    }

    async OceanTheme(oceanTheme) {
        if (oceanTheme && this.theme != 'ocean') {
            await this.world.initOceanWorld();
            this.theme = 'ocean';
        }
    }

    async FootTheme(footTheme) {
        if (footTheme && this.theme != 'foot') {
            await this.world.initFootWorld();
            this.theme = 'foot';
        }
    }

    async NeonTheme(neonTheme) {
        if (neonTheme && this.theme != 'neon') {
            await this.world.initNeonWorld();
            this.theme = 'neon';
        }
    }

    async add_custom_settings() {
        const birdsTheme = document.getElementById("SwitchCheckBirdsTheme").checked;
        const oceanTheme = document.getElementById("SwitchCheckOceanTheme").checked;
        const footTheme = document.getElementById("SwitchCheckFootTheme").checked;
        const neonTheme = document.getElementById("SwitchCheckNeonTheme").checked;
        const sambaTheme = document.getElementById("SwitchCheckSambaTheme").checked;
        const pongTheme = document.getElementById("SwitchCheckPongTheme").checked;

        if (sambaTheme != this.settingPanel.switch5) await this.initSamba(sambaTheme);
        if (birdsTheme != this.settingPanel.switch1) await this.BirdsTheme(birdsTheme);

        this.switchPanelSaver();

        switch (true) {
            case oceanTheme:
                await this.OceanTheme(oceanTheme);
                break;
            case footTheme:
                await this.FootTheme(footTheme);
                break;
            case neonTheme:
                await this.NeonTheme(neonTheme);
                break;
            case pongTheme:
                await this.DefaultTheme();
                break;
            case this.theme != 'default':
                await this.DefaultTheme();
        }
    }

}

export { SettingsManager };