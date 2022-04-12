const User = require('../models/user');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res,next)=>{
    try{
        const{ email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
           // console.log(registeredUser);
            req.flash('success','Welcome to PlayGather!');
            res.redirect('/playgrounds');
        })

    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo||'/playgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/playgrounds');
}

module.exports.renderProfile=async(req,res)=>{
    const user = await User.findById(req.user._id)
    .populate({
            path:'playdates',
            populate:{
                path:'paticipates',
                path:'playground'
            }
    }).populate({
            path:'joinedPlaydates',
            populate:[
                {
                    path:'sponsor',
                    model: 'User'
                },
                {
                    path:'playground',
                    model:'Playground'
                }
            ]
    });
    console.log(user.joinedPlaydates)
    res.render('users/profile',{user});
}