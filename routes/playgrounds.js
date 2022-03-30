const express = require ('express');
const router = express.Router();
//require our defined error handler class
const catchAsync = require('../utils_helper/catchAsync')
//const ExpressError = require('../utils_helper/ExpressError')
//require the Joi playgroundSchema, reviewSchema for validation
//const {playgroundSchema} = require('../schemas.js');
const {isLoggedIn, isAuthor, validatePlayground} = require('../middleware')
const playgrounds = require('../controllers/playgrounds')


router.route('/')
    .get(catchAsync(playgrounds.index))
    .post(isLoggedIn,validatePlayground,catchAsync(playgrounds.createPlayground));
    
//show playground list
//router.get('/',catchAsync(playgrounds.index));

//add a new playground: playgrounds/new
router.get('/new',isLoggedIn, playgrounds.renderNewForm);

//playground/new: post save to db
//add validation middleware function for add new object
//router.post('/',isLoggedIn,validatePlayground,catchAsync(playgrounds.createPlayground));


router.route('/:id')
    .get(catchAsync(playgrounds.showPlayground))
    .put(isLoggedIn,isAuthor, validatePlayground,catchAsync(playgrounds.edit))
    .delete(isLoggedIn,isAuthor, catchAsync(playgrounds.delete));
//show specific playground details
//router.get('/:id', catchAsync(playgrounds.showPlayground));

//playgrounds/:id/edit:  edit form with original value
router.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(playgrounds.renderEdit));

//playgrounds/:id : update to database from edit page
//router.put('/:id', isLoggedIn,isAuthor, validatePlayground,catchAsync(playgrounds.edit));

//playgrounds/:id   :delete from database
//router.delete('/:id',isLoggedIn,isAuthor, catchAsync(playgrounds.delete));

module.exports = router;