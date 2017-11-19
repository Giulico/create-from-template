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

    const destPath = settings.destPath;
    const srcPath = settings.srcPath;

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

            const componentDirectory = `${destPath}/${res.name}/`;

            // Make component dir
            fs.mkdirSync(`${componentDirectory}`);

            // Loop throught template files
            fs.readdirSync(srcPath).forEach(name => {

                const fileStats = `${srcPath}/${name}`;

                if (fs.lstatSync(fileStats).isDirectory()) {
                    console.log('DIRECTORY SKIPPED');
                } else {

                    const templateFile = require(`${srcPath}/${name}`);

                    console.log('File of type: ', typeof templateFile);

                    if (typeof templateFile === 'function') {

                        fs.writeFileSync(`${componentDirectory}${name}`, templateFile({
                            name: res.name
                        }));

                    } else {
                        console.log(chalk.red(`Template ${name} doesn't export a function`))
                    }
                }
            })

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
  if (!settings.srcPath) {
    throw "srcPath is required when running createTemplate function.";
  }
  if (!settings.destPath) {
    throw "destPath is required when running createTemplate function.";
  }
}

module.exports = createTemplate;