const mongoose = require('mongoose');
const Playground = require('./playground');
const User = require('./user');
const Schema = mongoose.Schema;

const PlaydatesSchema = new Schema({
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
    date:{
        type: Date,
        required: true,
    },
    durition:{
        type: Number,
        required: true,
    },
    active:{
        type: Boolean,
        default: false,
    }
});