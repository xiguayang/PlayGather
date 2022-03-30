const express = require ('express');
const router = express.Router({mergeParams: true});
const{validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const catchAsync = require('../utils_helper/catchAsync');
const ExpressError = require('../utils_helper/ExpressError');
const Playground = require('../models/playground');
const Review = require('../models/review')



router.post('/', isLoggedIn, validateReview, catchAsync(async(req,res)=>{
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    //console.log(review.rating)
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success','Create new review!')
    res.redirect(`/playgrounds/${playground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor,catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    //use pull to delete the review related in  the playground
    await Playground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!')
    res.redirect(`/playgrounds/${id}`);
}))

module.exports = router;