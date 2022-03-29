const mongoose = require('mongoose');
const Review = require('./review');
const Playdates = require('./playdate');
const Schema = mongoose.Schema;

const PlaygroundSchema = new Schema({
    
    title: String,
    description: String,
    theme: String,
    //zipCode: String,
    address: String,
    devices: String,
    image: String,
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
    ]
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
