const versionNode = Number(process.version.split('.')[0].substring(1));

function readPackage(pkg) {
    if (versionNode >= 18) {
        return pkg;
    }
    const { devDependencies } = pkg;

    if (devDependencies.typedoc) {
        delete devDependencies.typedoc;
    }

    return pkg;
}

module.exports = {
    hooks: {
        readPackage,
    }
};