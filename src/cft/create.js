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

    const name = settings.name;
    const destPath = settings.destPath;
    const srcPath = settings.srcPath;

    // If destPath doesn't exist, create it
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

            // Check if srcPath exists
            if (!fs.existsSync(srcPath) || !fs.lstatSync(srcPath).isDirectory()) {
                console.log(chalk.red('Specified templatePath doesn\'t exists'));
                return;
            }

            const componentDirectory = `${destPath}/${res.name}/`;

            // Make component dir
            fs.mkdirSync(`${componentDirectory}`);

            // Loop throught template files
            fs.readdirSync(srcPath).forEach(name => {

                const srcFilePath = `${srcPath}/${name}`;

                if (fs.lstatSync(srcFilePath).isDirectory()) {
                    console.log(chalk.yellow('Sub directory are not currently supported'));
                } else {

                    const templateFile = require(`${srcPath}/${name}`);

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
  if (!settings.name) {
    throw "name is required when running createTemplate function.";
  }
  if (!settings.srcPath) {
    throw "srcPath is required when running createTemplate function.";
  }
  if (!settings.destPath) {
    throw "destPath is required when running createTemplate function.";
  }
}

module.exports = createTemplate;