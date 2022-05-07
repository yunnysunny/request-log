import middleware from '../../'

middleware({dataFormat: function(data) {
    return JSON.stringify(data);
}});