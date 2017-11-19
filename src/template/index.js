module.exports = (params) => `
import style from './style.scss';

class ${params.name} {
    constructor() {
        return this
    }
}

export default ${params.name};
`