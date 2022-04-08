const mongoose = require('mongoose');
const Playground = require('./playground');
const User = require('./user');
const Schema = mongoose.Schema;

const PlaydateSchema = new Schema({
    sponser:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    paticipates: [
        {
            type: Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    totalNum:{
        type: Number,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    date:{
        type: Date,
        
    },
    durition:{
        type: Number,
        required: true,
    },
    active:{
        type: Boolean,
        default: false,
    },
    remarks:{
        type: String
    }
});

module.exports =mongoose.model('Playdate',PlaydateSchema);