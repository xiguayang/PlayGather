const express = require ('express');
const router = express.Router({mergeParams: true});
const{isLoggedIn} = require('../middleware');
const catchAsync = require('../utils_helper/catchAsync');
const ExpressError = require('../utils_helper/ExpressError');
const playdates = require('../controllers/playdates')


router.post('/', isLoggedIn, catchAsync(playdates.createPlaydate));
router.get('/new',isLoggedIn, catchAsync(playdates.renderNewPlaydate));

module.exports = router;