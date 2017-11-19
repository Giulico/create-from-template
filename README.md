# create-from-template
Create a component from a template.

## Configuration

### Installation
```bash
yarn add -D create-custom-template
```

evenutally install your custom templates (aka adapters)
```bash
yarn add -D cft-adapter
```

package.json
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
Ok, let's create a custom template!

A custom template is a `template` folder which contains a list of files. Each file *must* export a function.

es.
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