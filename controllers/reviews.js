const Playground = require('../models/playground');
const Review = require('../models/review')

module.exports.createReview = async(req,res)=>{
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //console.log(review.rating)
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success','Create new review!')
    res.redirect(`/playgrounds/${playground._id}`)
}

module.exports.deleteReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    //use pull to delete the review related in  the playground
    await Playground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!')
    res.redirect(`/playgrounds/${id}`);
}