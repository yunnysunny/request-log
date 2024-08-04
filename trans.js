const fs = require('fs');
const path = require('path');

const convertToTs = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            convertToTs(fullPath);
        } else if (path.extname(fullPath) === '.js') {
            const tsPath = fullPath.replace(/\.js$/, '.ts');
            fs.renameSync(fullPath, tsPath);
            console.log(`Renamed: ${fullPath} -> ${tsPath}`);
        }
    });
};

convertToTs(path.join(__dirname, 'test'));