import {Schema} from 'mongoose';

export const requestLogSchema =  new Schema({
    req_time: Date
},{ 
    autoIndex: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt : 'update_at'
    },
    strict: false
});
