const setSize = (container, camera, renderer) => {
    const colHeight = document.querySelector('.col-md-2').clientHeight;

    camera.aspect = container.clientWidth / colHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, colHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
}

class Resizer {
    constructor(container, camera, renderer) {
        setSize(container, camera, renderer);

        window.addEventListener('resize', () => {
            setSize(container, camera, renderer);
            this.onResize();
        });
    }
    onResize() {}
}

export { Resizer };
