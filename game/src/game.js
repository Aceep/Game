import { World } from './World/world.js';
import { waitForElement , preloadGif } from './utils.js';

console.clear();

async function main() {

    const container = await waitForElement('#game');  

    try {
        await preloadGif('ressources/loading.gif');
    } catch (error) {
        console.error('Erreur lors du préchargement du GIF', error);
    }

    const world = new World(container);

    await world.init();
    world.start();
}

document.addEventListener('DOMContentLoaded', (event) => {
    main().catch((err) => {
        console.error(err);
    });
});
