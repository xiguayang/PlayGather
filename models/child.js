const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChildSchema= new Schema({
    name:{
        type: String,
        unique: true,
    },
    age: Number,
    gender: {
        type: String,
        enum : ['Boy','Girl'],
    },
    hobbies: String,
});

module.exports= mongoose.model('Child', ChildSchema);