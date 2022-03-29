const express = require ('express');
const router = express.Router();
//require our defined error handler class
const catchAsync = require('../utils_helper/catchAsync')
const ExpressError = require('../utils_helper/ExpressError')
const Playground = require('../models/playground');

//require the Joi playgroundSchema, reviewSchema for validation
const {playgroundSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware')
//define a validation middleware function to validate the input campground object
const validatePlayground =(req, res, next) =>{
    const {error} = playgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
}

//show playground list
router.get('/',catchAsync(async(req,res,next)=>{
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index',{playgrounds});
}))

//add a new playground: playgrounds/new
router.get('/new',isLoggedIn, (req,res)=>{

    res.render('playgrounds/new');
})
//playground/new: post save to db
//add validation middleware function for add new object
router.post('/',isLoggedIn,validatePlayground,catchAsync(async(req,res,next)=>{
    const playground = new Playground(req.body.playground);
    //res.send(req.body);
    await playground.save();
    req.flash('success','Successfully added a new playground!')
    res.redirect(`/playgrounds/${playground._id}`)
}))

//show specific playground details
router.get('/:id', catchAsync(async(req,res,next)=>{
    
    const playground = await (await Playground.findById(req.params.id).populate('reviews'));
    
    if(!playground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/playgrounds')
    }
    res.render('playgrounds/show',{playground})
}))

//playgrounds/:id/edit:  edit form with original value
router.get('/:id/edit',isLoggedIn,catchAsync(async(req,res,next)=>{
    const playground = await Playground.findById(req.params.id);
    if(!playground){
        req.flash('error','Cannot find that playground')
        return res.redirect('/campgrounds')
    }
    res.render('playgrounds/edit', {playground})
}) )
//playgrounds/:id : update to database from edit page
router.put('/:id', isLoggedIn,validatePlayground,catchAsync(async(req,res,next)=>{
    //res.send('it worked') used for test
    const {id} = req.params;
    const playground = await Playground.findByIdAndUpdate(id,{...req.body.playground})
    req.flash('success','Successfully updated the playground!')
    res.redirect(`/playgrounds/${playground._id}`)
}))

//playgrounds/:id   :delete from database
router.delete('/:id',isLoggedIn,catchAsync(async(req, res,next)=>{
    const {id} = req.params;
    await Playground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the playground!')
    res.redirect('/playgrounds')
}))
module.exports = router;