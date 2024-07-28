function absoluteUrl(path) {
    return `${process.env.REACT_PUBLIC_APP_URL}${path}`;
}

module.exports = absoluteUrl;