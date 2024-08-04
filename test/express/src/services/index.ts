const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('../lib/string');


const shemasPath = path.join(__dirname, '../schemas');
/**
 * @var {Model} UsersModel
 */
const models: { [key: string]: any } = {};
fs.readdirSync(shemasPath).filter(function(filename: string): boolean {
    return filename.endsWith('_schema.js');
}).forEach(function(filename: string) {
    const key: string = filename.replace('_schema.js','Model').firstUpperCase();
    const name: string = key.slice(0,-5).toLowerCase();
    models[key] = mongoose.model(name,require(path.join(shemasPath, filename)));
});

module.exports = models;