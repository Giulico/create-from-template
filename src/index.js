const path = require('path');
const appRoot = require('app-root-path').path;
const fs = require('fs');
const _ = require('lodash');
const detectIndent = require('detect-indent');
const createTemplate = require('./cft/create');

const init = require('./cft/init');

let packageJsonPath = path.resolve(appRoot, 'package.json');
let packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');

// tries to detect the indentation and falls back to a default if it can't
let indent = detectIndent(packageJsonString).indent || '  ';
let packageJsonContent = JSON.parse(packageJsonString);
let newPackageJsonContent = '';

// CFT Config
const cftConfig = _.get(packageJsonContent, 'config.cft');

const defaultSettings = {
    name: 'unknown',
    srcPath: path.resolve(__dirname, 'template'),
    destPath: 'app/components'
}

if (Array.isArray(cftConfig)) {

    // Configuration as array
    //
    // "commitizen": [
    //   {
    //     "name": "stocazzo",
    //     "templatePath": "node_modules/cz-aq-changelog"
    //   }
    // ]
    if (cftConfig.length === 1) {
        const settings = Object.assign({}, defaultSettings, init.getSettings(cftConfig[0]));
        createTemplate(settings);
    } else {
        init
            .chooseTemplate(cftConfig)
            .then(config => {
                const settings = Object.assign({}, defaultSettings, init.getSettings(config));
                createTemplate(settings);
            });
    }

} else if (typeof cftConfig === 'object') {

    // Configuration as single object
    //
    //
    // "cft": {
    //   "templatePath": "node_modules/ctf-adapter"
    // }
    const settings = Object.assign({}, defaultSettings, init.getSettings(cftConfig));
    createTemplate(settings);

} else {

    // No configuration specified
    createTemplate(defaultSettings);

}

module.exports = {};