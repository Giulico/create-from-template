const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const findNodeModules = require('find-node-modules');
const detectIndent = require('detect-indent');
const sh = require('shelljs');
const utils = require('./utils/index');
const createTemplate = require('./cft/create');

const getNearestNodeModulesDirectory = utils.getNearestNodeModulesDirectory;
const getNearestProjectRootDirectory = utils.getNearestProjectRootDirectory;

let packageJsonPath = path.join(getNearestProjectRootDirectory(), 'package.json');
let packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');

// tries to detect the indentation and falls back to a default if it can't
let indent = detectIndent(packageJsonString).indent || '  ';
let packageJsonContent = JSON.parse(packageJsonString);
let newPackageJsonContent = '';

const defaultSettings = {
    templatePath: './template',
    destPath: 'app/components'
}
const settings = {};

const customTemplatePath = _.get(packageJsonContent, 'config.cft.templatePath');
if (typeof customTemplatePath === 'string' && customTemplatePath.length > 0) {
    console.log('got a custom template');
    settings.templatePath = customTemplatePath;
}

const customDestPath = _.get(packageJsonContent, 'config.cft.destPath');
if (typeof customDestPath === 'string' && customDestPath.length > 0) {
    settings.destPath = customDestPath;
}

// console.log(Object.assign({}, defaultSettings, settings));
createTemplate(Object.assign({}, defaultSettings, settings));


module.exports = {};