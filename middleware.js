

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