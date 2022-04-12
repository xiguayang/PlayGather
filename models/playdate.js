const mongoose = require('mongoose');
const Playground = require('./playground');
const User = require('./user');
const Schema = mongoose.Schema;

const PlaydateSchema = new Schema({
    sponsor:{
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
        default: Date.now 
    },
    contact:{
        type: String,
        required: true,
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
    },
    playground:{
        type: Schema.Types.ObjectId,
        ref:'Playground'
    },
});

module.exports =mongoose.model('Playdate',PlaydateSchema);