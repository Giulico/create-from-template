# create-from-template
Create a component from a template.

## Configuration
package.json
```javascript
{
    // ...
    "config": {
        "cft": {
            // templatePath specifies the path, starting from your
            // app root folder, of the templates folder
            "templatePath": "path_to_template_folder",
            // destPath specifies where to create your component
            // It also starts from your root folder
            "destPath": "path_to_destination_folder"
        }
    }
    // ...
}
```