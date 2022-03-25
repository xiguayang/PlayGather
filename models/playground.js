const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaygroundSchema = new Schema({
    title: String,
    description: String,
    theme: String,
    //zipCode: String,
    address: String,
    devices: String,
    image: String
});
module.exports =mongoose.model('Playground',PlaygroundSchema);
