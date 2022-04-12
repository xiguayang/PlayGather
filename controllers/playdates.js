const Playdate = require('../models/playdate');
const Playground = require('../models/playground');
const User = require('../models/user')

module.exports.renderNewPlaydate =async(req,res)=>{
    const playground = await Playground.findById(req.params.id);
    res.render('playdates/new',{playground});
}

module.exports.createPlaydate =async(req,res,next)=>{
    const playground = await Playground.findById(req.params.id);

    const playdate = new Playdate(req.body.playdate);
    playdate.sponsor = req.user._id;
    playdate.active = true;
    playdate.playground = playground;
    if(playdate.contact==""){
        playdate.contact =req.user.email; 
    }
    //console.log(playdate.date)
   // console.log(playdate);
    playground.playdates.push(playdate);
    req.user.playdates.push(playdate);
    // res.send(req.body);
    await playdate.save();
    await playground.save();
    await req.user.save();
    
    req.flash('success','Successfully arrange a new playdate!')
    res.redirect(`/playgrounds/${playground._id}`)
}

module.exports.renderPlaydateModify =async(req,res)=>{
    const {id,playdateId} = req.params;

    const playdate = await Playdate.findById(playdateId);

    var options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    const dayVal = playdate.date.toLocaleString("en-US", options).replace(/\//g, '-');
    const day = dayVal.slice(-4)+"-"+dayVal.substring(0,5);
    //2022-04-14T00:00:01
    let o = new Intl.DateTimeFormat("en" , {
        timeStyle: "medium",
        hour12: false
    });
    const timeVal = o.format(playdate.date)

    const datevalue = day+"T"+timeVal
    console.log(datevalue)
    //const datevalue =formatDate(playdate.date);
    res.render('playdates/modify',{playdate, id, datevalue});
}

module.exports.modifyPlaydate =async(req,res,next)=>{

    const {id,playdateId} = req.params;
    //const playground = await Playground.findById(req.params.id);
    //console.log(req.body);
    const playdate = await Playdate.findByIdAndUpdate(playdateId,{...req.body.playdate});
    // if(playdate.contact==""){
    //     playdate.contact = req.user.email;
    // }
    //console.log(playdate);
    //playground.playdates.push(playdate);
    playdate.active = true;
    await playdate.save();
    //await playground.save();   
    req.flash('success','Successfully modify the playdate!')
    res.redirect(`/playgrounds/${id}`)

}

module.exports.renderJoinPlaydate =async(req,res)=>{
    const {id,playdateId} = req.params;
    const playdate = await Playdate.findById(playdateId);
    res.render('playdates/join',{id, playdate});
}

module.exports.joinPlaydate =async(req,res)=>{
    const {id,playdateId} = req.params;
    const playdate = await Playdate.findById(playdateId).populate('paticipates');
    if(!playdate.sponsor.equals(req.user._id)){
        playdate.paticipates.push(req.user);
        req.user.joinedPlaydates.push(playdate);
        await playdate.save();
        await req.user.save();
    }
    req.flash('success','Successfully join the playdate!')
    res.redirect(`/playgrounds/${id}`)
}


module.exports.cancelPlaydate = async(req, res)=>{
    //==> Cancel playdate: to make active false, not direclty delete it
    const {id,playdateId} = req.params;
    const playdate = await Playdate.findById(playdateId);
    playdate.active = false;
    await playdate.save();
    //await playground.save()
    req.flash('success','Successfully Cancel the playdate!')
    res.redirect(`/playgrounds/${id}`)

}

module.exports.deletePlaydate = async(req, res)=>{
    const {id, playdateId} = req.params;
    //use pull to delete the review related in  the playground
    await Playground.findByIdAndUpdate(id, {$pull:{playdates: playdateId}});
    await User.findByIdAndUpdate(req.user._id, {$pull:{playdates: playdateId}});
    await Playdate.findByIdAndDelete(playdateId);
    req.flash('success','Successfully Delete the Playdate!')
    res.redirect(`/playgrounds/${id}`);
}