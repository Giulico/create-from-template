const path = require('path');
const fs = require('fs');
const {camelCase, upperFirst} = require('lodash/string');
const inquirer = require('inquirer');
const shell = require('shelljs');
const chalk = require('chalk');

/**
 * Checks to make sure that the required arguments are passed
 * Throws an exception if any are not.
 */
function checkRequiredArguments(settings) {
    if (!settings.name) {
        throw new Error('name is required when running createTemplate function.');
    }
    if (!settings.srcPath) {
        throw new Error('srcPath is required when running createTemplate function.');
    }
    if (!settings.destPath) {
        throw new Error('destPath is required when running createTemplate function.');
    }
}

function createTemplate(settings) {
    // Don't let things move forward if required args are missing
    checkRequiredArguments(settings);

    const {destPath, srcPath} = settings;

    // If destPath doesn't exist, create it
    try {
        fs.lstatSync(destPath).isDirectory();
    } catch (err) {
        console.log(chalk.black.bold.bgYellow(`
**************************************************************
Destination path doesn't exist. CFT made it for you.
Path: ${destPath}

Did you miss to read the documentation?
Documentation: https://github.com/Giulico/create-from-template
**************************************************************
`));
        shell.mkdir('-p', destPath);
    }

    return new Promise(resolve => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Type the name of the component:',
                filter: name => upperFirst(camelCase(name)),
                validate: name => {
                    const existingComponents = fs.readdirSync(destPath)
                        .filter(file => fs.lstatSync(path.join(destPath, file)).isDirectory());
                    const expression = !(name === '') && !existingComponents.includes(name);
                    const message = name === '' ? 'Name is mandatory' : 'This component already exist';
                    return expression ? true : message;
                }
            }
        ])
            .then(res => {
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
                        // If template contains a directory
                        console.log(chalk.yellow('Sub directory are not currently supported'));
                    } else {
                        const templateFile = require(`${srcPath}/${name}`); // eslint-disable-line

                        if (typeof templateFile === 'function') {
                            // Process file
                            fs.writeFileSync(`${componentDirectory}${name}`, templateFile({
                                name: res.name
                            }));
                        } else {
                            // This file doesn't export a function
                            console.log(chalk.red(`Template ${name} doesn't export a function`));
                        }
                    }
                });

                resolve();
            })
            .catch(err => console.log(err));
    });
}

module.exports = createTemplate;