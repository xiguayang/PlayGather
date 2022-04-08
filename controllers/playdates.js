const Playdate = require('../models/playdate');
const Playground = require('../models/playground');

module.exports.renderNewPlaydate =async(req,res)=>{
    const playground = await Playground.findById(req.params.id);
    res.render('playdates/new',{playground});
}

module.exports.createPlaydate =async(req,res,next)=>{
    const playground = await Playground.findById(req.params.id);
    const playdate = new Playdate(req.body.playdate);
    playdate.sponser = req.user._id;
    playdate.active = true;
    
    playground.playdates.push(playdate);
    
    // res.send(req.body);
    await playdate.save();
    await playground.save();
    
    req.flash('success','Successfully arrange a new playdate!')
    res.redirect(`/playgrounds/${playground._id}`)
}