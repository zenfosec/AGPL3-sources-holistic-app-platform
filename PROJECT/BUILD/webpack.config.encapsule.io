// webpack.config.arccore.js

const path = require('path');
const entryPath = path.resolve(path.join(__dirname, '../../BUILD/APP/encapsule/encapsule.io/phase1-transpile/server/server.js'));
const outputPath = path.resolve(path.join(__dirname, '../../BUILD/APP/encapsule/encapsule.io/phase2-webpack/'));

console.log("webpack entry module path: " + entryPath);
console.log("webpack output path: " + outputPath);

module.exports = {
    mode: 'production',
    plugins: [
    ],
    entry: {
        main: entryPath
    },
    target: "node",
    output: {
        path: outputPath,
        filename: 'server-app-bundle.js',
        libraryTarget: "commonjs2"
    }
};
