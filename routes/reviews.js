const express = require ('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils_helper/catchAsync');
const ExpressError = require('../utils_helper/ExpressError');
const Playground = require('../models/playground');
const Review = require('../models/review')
const {reviewSchema} = require('../schemas.js');

const validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}
router.post('/', validateReview, catchAsync(async(req,res)=>{
    const playground = await Playground.findById(req.params.id);
    const review = new Review(req.body.review);
    //console.log(review.rating)
    playground.reviews.push(review);
    await review.save();
    await playground.save();
    req.flash('success','Create new review!')
    res.redirect(`/playgrounds/${playground._id}`)
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>{
    const {id, reviewId} = req.params;
    //use pull to delete the review related in  the playground
    await Playground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted the review!')
    res.redirect(`/playgrounds/${id}`);
}))

module.exports = router;