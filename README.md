# create-from-template
Create a component from a template.

## Install cft

From your favourite package manager:
```bash
yarn add -D create-custom-template
```
Now you should be able to create from templates
```bash
node node_modules/create-from-template
```
or add add a script to your package.json
```javascript
{
    // ...
    "scripts": {
        // ...
        "cft": "node node_modules/create-from-template"
    }
    // ...
}
```
then
```bash
yarn cft
```
## Configuration
In order to configure cft, open your package.json, search (or add) "*config*", and create "*cft*" property with the following options.

`package.json`
```javascript
{
    // ...
    "config": {
        "cft": {
            // templatePath specifies the path, starting from your
            // app root folder, of the templates folder
            // es. "node_modules/cft_adapter"
            //
            // (default) "node_modules/create-from-template/src/template"
            //
            "templatePath": "path_to_template_folder",

            // destPath specifies where to create your component
            // It also starts from your root folder
            // es. "src/common/components"
            //
            // (default) "app/components"
            //
            "destPath": "path_to_destination_folder"
        }
    }
    // ...
}
```

## Custom templates
You can place your custom template wherever you want. I suggest you to create a new repo and install it as dev dependency.

Ok, let's create a custom template.

A custom template is a `template` folder which contains a list of files. Each file *must* export a function.

es.

```
node_modules/
    cft_adapter/
        template/
            file.js
            my_other_file.scss

```

`template/file.js`
```javascript
module.exports = (params) => `
class ${params.name} {
    constructor() {
        return this
    }
}
`
```
`template/my_other_file.scss`
```
module.exports = (params) => `
.root {
    display: block
}
`
```

The string returned from the template function rapresents your output.

Within the function you can use some parameters.

### Params
- *name* - The name that you type in the wizard