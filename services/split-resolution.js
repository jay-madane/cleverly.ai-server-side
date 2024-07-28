function splitResolution(resolution) {
    const [width, height] = resolution.split('x').map(Number);
    return { width, height };
}

module.exports = splitResolution;