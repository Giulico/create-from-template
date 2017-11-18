const path = require('path');
const fs = require('fs');
const {camelCase, upperFirst} = require('lodash/string');
const inquirer = require('inquirer');
const appRoot = require('app-root-path').path;
const shell = require('shelljs');
const chalk = require('chalk');

function createTemplate(settings) {

    // Don't let things move forward if required args are missing
    checkRequiredArguments(settings);

    const destPath = path.resolve(appRoot, settings.destPath);
    const srcPath = path.resolve(__dirname, '..', settings.templatePath);

    // Is destPath doesn't exist, create it
    try {
        fs.lstatSync(destPath).isDirectory();
    } catch(err) {
        console.log(chalk.black.bold.bgYellow(`Destination path didn\'t exist. CFT made it for you.\n>>> ${destPath}\n\nDid you miss to read the documentation? -> https://github.com/Giulico/create-from-template`));
        shell.mkdir('-p', destPath);
    }

    return new Promise((resolve, reject) => {
        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'name',
                    message: 'Type the name of the component:',
                    filter: (name) => upperFirst(camelCase(name)),
                    validate: (name) => {
                        const existingComponents = fs.readdirSync(destPath).filter(file => fs.lstatSync(path.join(destPath, file)).isDirectory());
                        const expression = !(name === '') && !existingComponents.includes(name);
                        const message = name === '' ? 'Name is mandatory' : 'This component already exist';
                        return expression ? true : message;
                    }
                }
            ]
        ).then((res) => {

            const name = res.name;
            const componentDirectory = `${destPath}/${name}/`;

            fs.mkdirSync(`${componentDirectory}`);

            const js = require(srcPath)({
                name
            });

            fs.writeFileSync(`${componentDirectory}${name}.js`, js);

            resolve();

        })
        .catch(err => console.log(err));

    });


}


/**
 * Checks to make sure that the required arguments are passed
 * Throws an exception if any are not.
 */
function checkRequiredArguments(settings) {
  if (!settings.templatePath) {
    throw "templatePath is required when running createTemplate function.";
  }
  if (!settings.destPath) {
    throw "destPath is required when running createTemplate function.";
  }
}

module.exports = createTemplate;