const mongoose = require('mongoose');
const Review = require('./review');
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
