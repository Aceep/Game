import { Loop } from './World/systems/Loop.js';
let gifUrl;

async function waitForElement(selector) {
    while (document.querySelector(selector) === null) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
}

async function toggleLeftOffcanvas() {
    const leftOffcanvas = await waitForElement('#offcanvasLeft');
    var leftOffcanvasInstance = new bootstrap.Offcanvas(leftOffcanvas);
    leftOffcanvasInstance.toggle();
}
// Function to toggle right offcanvas menu
async function toggleRightOffcanvas() {
    const rightOffcanvas = await waitForElement('#offcanvasRight');
    var rightOffcanvasInstance = new bootstrap.Offcanvas(rightOffcanvas);
    rightOffcanvasInstance.toggle();
}

function showloadingScreen() {
    try {
        const gif = getGifUrl();
        
        desactivateButtons();

        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.classList.add('sm-10');
        loadingScreen.style.backgroundImage = `url(${gif.src})`;
        loadingScreen.style.backgroundRepeat = 'no-repeat';
        loadingScreen.style.backgroundPosition = 'center';

        document.getElementById('game').appendChild(loadingScreen);
    } catch (error) {
        console.error('Error showing the loading screen', error);
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.remove();
    }
    
    activateButtons();
}

async function showStartScreen() {
    return new Promise((resolve) => {

    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.class = 'sm-10';

    document.getElementById('game').appendChild(startScreen);

    setTimeout(() => {
        hideStartScreen();
        resolve();
    }, 3500);  // Wait for 3.5 seconds before hiding the start screen
    });
}

function hideStartScreen() {
    const StartScreen = document.getElementById('start-screen');
    
    if (StartScreen) {
        StartScreen.remove();
    }
}

function    preloadGif(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            gifUrl = img;
            resolve(img);
        };
        img.onerror = (error) => reject(error);
    });
}

function getGifUrl() {
    if (!gifUrl) {
        throw new Error('GIF not preloaded');
    }
    return gifUrl;
}

function showFadingScreen() {
    return new Promise((resolve) => {
        const resultScreen = document.createElement('div');
        resultScreen.id = 'result-screen';
        //resultScreen.className = 'sm-10 fade-in';

        document.getElementById('game').appendChild(resultScreen);

        setTimeout(() => {
            resultScreen.classList.remove('fade-out');
            resultScreen.classList.add('fade-in');
        }, 50); // Wait for the element to be added to the DOM

        // Wait for the fade-in effect to complete before resolving the promise
        setTimeout(() => {
            resolve();
        }, 1000); // 1 second for the fade-in effect
    });
}

function hideFadingScreen() {
    return new Promise((resolve) => {
        const resultScreen = document.getElementById('result-screen');

        if (resultScreen) {
            resultScreen.classList.remove('fade-in');
            resultScreen.classList.add('fade-out');

            // Wait for the fade-out effect to complete before removing the element
            setTimeout(() => {
                resultScreen.remove();
                resolve();
            }, 1000); // 1 second for the fade-out effect
        }
    });
}

function activateButtons(loop) {
    document.getElementById('settingButton').disabled = false;
    document.getElementById('start_button').disabled = false;
    document.getElementById('toogleButton').disabled = false;
    if (loop) loop.gameStarted = false;
}

function desactivateButtons(loop) {
    document.getElementById('settingButton').disabled = true;
    document.getElementById('start_button').disabled = true;
    document.getElementById('toogleButton').disabled = true;
    if (loop) loop.gameStarted = true;
}

export { waitForElement , toggleLeftOffcanvas, toggleRightOffcanvas , showloadingScreen , hideLoadingScreen , showStartScreen , preloadGif , showFadingScreen , hideFadingScreen, activateButtons, desactivateButtons };