const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils_helper/catchAsync')
const users = require('../controllers/users')
const{isLoggedIn} = require('../middleware');


router.route('/register')
    .get(users.renderRegister)
    .post( catchAsync(users.register))
// router.get('/register', users.renderRegister);
// router.post('/register', catchAsync(users.register));


router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login);
// router.get('/login', users.renderLogin);
// router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),users.login);
router.get('/profile',isLoggedIn,catchAsync(users.renderProfile))


router.get('/logout',users.logout);

module.exports = router;