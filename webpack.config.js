const path = require('path');

module.exports = {
    target: 'node',
    entry: './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: 'ClearCos',
        libraryTarget: 'umd'
    },
    node: {
        __filename: false,
        __dirname: false,
    }
}