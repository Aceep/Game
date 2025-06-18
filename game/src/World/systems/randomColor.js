// Random color generator that avoids black, red and blue colors

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color;
    do {
        color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
    } while (isUnwantedColor(color));
    return color;
}

function isUnwantedColor(color) {
    const unwantedColors = [
        { r: 0, g: 0, b: 0 },     // black
        { r: 255, g: 0, b: 0 },   // red
        { r: 0, g: 0, b: 255 }    // blue
    ];

    const rgb = hexToRgb(color);
    return unwantedColors.some(unwanted => isColorClose(unwanted, rgb, 50));
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
}

function isColorClose(color1, color2, threshold) {
    const distance = Math.sqrt(
        (color1.r - color2.r) ** 2 +
        (color1.g - color2.g) ** 2 +
        (color1.b - color2.b) ** 2
    );
    return distance < threshold;
}

export { getRandomColor };