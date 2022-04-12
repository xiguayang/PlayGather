
const {reviewSchema, playgroundSchema} = require('./schemas.js');
const ExpressError = require('./utils_helper/ExpressError');
const Review = require('./models/review')
const Playground = require('./models/playground')
const Playdate = require('./models/playdate')
module.exports.isLoggedIn = (req,res,next)=>{
    //console.log("REQ.USER...", req.user)
    //middleware from passport: isAuthenticated
    if(!req.isAuthenticated()){
        //store the url they are requesting
        //console.log(req.path,req.originalUrl)
        req.session.returnTo = req.originalUrl;
        //console.log(req.session)
        req.flash('error','You must be signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.isAuthor = async(req,res, next) =>{
    const {id} = req.params;
    const playground = await Playground.findById(id);
    if(!playground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/playgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req,res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/playgrounds/${id}`);
    }
    next();
}

module.exports.isPlaydateSponsor = async(req,res, next) =>{
    const {playdateId} = req.params;
    //console.log(id)
    const playdate = await Playdate.findById(playdateId);
   // console.log(playdate)
    if(!playdate.sponsor.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/playgrounds/${id}`);
    }
    next();
}
//define a validation middleware function to validate the input campground object
module.exports.validatePlayground =(req, res, next) =>{
    const {error} = playgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

