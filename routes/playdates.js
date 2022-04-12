const express = require ('express');
const router = express.Router({mergeParams: true});
const{isLoggedIn, isPlaydateSponsor} = require('../middleware');
const catchAsync = require('../utils_helper/catchAsync');
const ExpressError = require('../utils_helper/ExpressError');
const playdates = require('../controllers/playdates')


router.post('/', isLoggedIn, catchAsync(playdates.createPlaydate));
router.get('/new',isLoggedIn, catchAsync(playdates.renderNewPlaydate));
router.put('/:playdateId',isLoggedIn, isPlaydateSponsor, catchAsync(playdates.modifyPlaydate))
router.put('/:playdateId/cancel',isLoggedIn, isPlaydateSponsor, catchAsync(playdates.cancelPlaydate))
router.delete('/:playdateId', isLoggedIn, isPlaydateSponsor,catchAsync(playdates.deletePlaydate));

router.put('/:playdateId/join',isLoggedIn, catchAsync(playdates.joinPlaydate))
router.get('/:playdateId/join',isLoggedIn,catchAsync(playdates.renderJoinPlaydate))
router.get('/:playdateId/modify',isLoggedIn, isPlaydateSponsor, catchAsync(playdates.renderPlaydateModify));
//router.get('/new',isLoggedIn, catchAsync(playdates.renderNewPlaydate));
module.exports = router;
