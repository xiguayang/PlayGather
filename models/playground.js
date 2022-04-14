const mongoose = require('mongoose');
const Review = require('./review');
const Playdates = require('./playdate');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
});
const PlaygroundSchema = new Schema({
    place_id:String,
    title: String,
    description: String,
    theme: String,
    //zipCode: String,
    address: String,
    devices: String,
    images: [ ImageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    playdates:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Playdate'
        }
    ],
    zip:String
});

PlaygroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
        // await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports =mongoose.model('Playground',PlaygroundSchema);
