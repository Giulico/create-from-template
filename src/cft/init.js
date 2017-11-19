const path = require('path');
const appRoot = require('app-root-path').path;
const inquirer = require('inquirer');

function getSettings(cftConfig) {
    const settings = {};

    // Check for templatePath props
    const customTemplatePath = cftConfig.templatePath;
    if (typeof customTemplatePath === 'string' && customTemplatePath.length > 0) {
        settings.srcPath = path.resolve(appRoot, customTemplatePath, 'template');
    }

    // Check for destPath props
    const customDestPath = cftConfig.destPath;
    if (typeof customDestPath === 'string' && customDestPath.length > 0) {
        settings.destPath = customDestPath;
    }

    // Check for destPath props
    const customName = cftConfig.name;
    if (typeof customName === 'string' && customName.length > 0) {
        settings.name = customName;
    }

    return settings;
}

function chooseTemplate(cftConfig) {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'Which template would you like to use?',
            choices: cftConfig.map((config, index) => config.name || `unknown-${index}`)
        }
    ])
        .then(answer => {
            let config = {};
            if (answer.name.startsWith('unknown-')) {
                const configIndex = answer.name.split('-')[1];
                config = cftConfig[configIndex];
            } else {
                config = cftConfig.find(c => c.name === answer.name);
            }
            return config;
        })
        .catch(err => console.log(err));
}

module.exports = {
    getSettings,
    chooseTemplate
};