const {Schema} = require('mongoose');

const requestLogSchema =  new Schema({
    req_time: Date
},{ 
    autoIndex: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt : 'update_at'
    },
    strict: false
});



module.exports = requestLogSchema;