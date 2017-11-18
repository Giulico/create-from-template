const path = require('path');
const findNodeModules = require('find-node-modules');

function getNearestProjectRootDirectory (options) {
    return path.join(process.cwd(), getNearestNodeModulesDirectory(options), '/../');
}

/**
 * Gets the nearest npm_modules directory
 */
function getNearestNodeModulesDirectory (options) {
    // Get the nearest node_modules directories to the current working directory
    let nodeModulesDirectories = findNodeModules(options);

    // Make sure we find a node_modules folder

    /* istanbul ignore else */
    if (nodeModulesDirectories && nodeModulesDirectories.length > 0) {
    return nodeModulesDirectories[0];
    } else {
    console.error(`Error: Could not locate node_modules in your project's root directory. Did you forget to npm init or npm install?`)
    }
}

/**
 * Gets a map of arguments where the value is the corresponding npm strings
 */
function getNpmInstallStringMappings (save, saveDev, saveExact, force) {
    return new Map()
      .set('save', (save && !saveDev) ? '--save' : undefined)
      .set('saveDev', saveDev ? '--save-dev' : undefined)
      .set('saveExact', saveExact ? '--save-exact' : undefined)
      .set('force', force ? '--force' : undefined);
}


/**
 * Generates an npm install command given a map of strings and a package name
 */
function generateNpmInstallAdapterCommand (stringMappings, adapterNpmName) {

      // Start with an initial npm install command
      let installAdapterCommand = `npm install ${adapterNpmName}`;

      // Append the neccesary arguments to it based on user preferences
      for (let [key, value] of stringMappings.entries()) {
        if (value) {
          installAdapterCommand = installAdapterCommand + ' ' + value;
        }
      }

      return installAdapterCommand;
}


/**
 * Executes the command passed to it at the path requested
 * using the instance of shelljs passed in
 */
function executeShellCommand (sh, path, installCommand) {
    sh.cd(path);
    sh.exec(installCommand);
}

/**
 * Modifies the package.json, sets config.commitizen.path to the path of the adapter
 * Must be passed an absolute path to the cli's root
 */
function addPathToAdapterConfig (sh, cliPath, repoPath, adapterNpmName) {

    let commitizenAdapterConfig = {
        config: {
            commitizen: {
            path: `./node_modules/${adapterNpmName}`
            }
        }
    };

    let packageJsonPath = path.join(getNearestProjectRootDirectory(), 'package.json');
    let packageJsonString = fs.readFileSync(packageJsonPath, 'utf-8');
    // tries to detect the indentation and falls back to a default if it can't
    let indent = detectIndent(packageJsonString).indent || '  ';
    let packageJsonContent = JSON.parse(packageJsonString);
    let newPackageJsonContent = '';
    if (_.get(packageJsonContent, 'config.commitizen.path') !== adapterNpmName) {
        newPackageJsonContent = _.merge(packageJsonContent, commitizenAdapterConfig);
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJsonContent, null, indent) + '\n');
}

module.exports = {
    getNearestNodeModulesDirectory,
    getNearestProjectRootDirectory,
    getNpmInstallStringMappings,
    generateNpmInstallAdapterCommand,
    executeShellCommand,
    addPathToAdapterConfig
}