const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Playdates = require('./playdate');
const Review = require('./review');

const UserSchema= new Schema({
    email:{
        type: String,
        required: true,
        
    },
    username:{
        type: String,
        unique: true,
    },
    playdates:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Playdate'
        }
    ],
    reviews:{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }
});
UserSchema.plugin(passportLocalMongoose);
module.exports= mongoose.model('User', UserSchema);