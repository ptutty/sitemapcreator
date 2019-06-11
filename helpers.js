
const fs = require('fs');

module.exports = {

    slugify(str) {
        return str.replace(/[\/:]/g, '_');
    },

    mkdirSync(dirPath) {
        try {
            dirPath.split('/').reduce((parentPath, dirName) => {
                const currentPath = parentPath + dirName;
                if (!fs.existsSync(currentPath)) {
                    fs.mkdirSync(currentPath);
                }
                return currentPath + '/';
            }, '');
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    }

}





