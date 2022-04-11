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
    if(playdate.contact==""){
        playdate.contact =req.user.email; 
    }
    //console.log(playdate.date)
   // console.log(playdate);
    playground.playdates.push(playdate);
    
    // res.send(req.body);
    await playdate.save();
    await playground.save();
    
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

module.exports.renderJoinPlaydate =async(req,res)=>{
    const {playdateId} = req.params;

    const playdate = await Playdate.findById(playdateId);
    //const playground = await Playground.findById(req.params.id);
    //console.log(playdate)
    res.render('playdates/join',{playdate});
}

module.exports.joinPlaydate =async(req,res)=>{
    const {id,playdateId} = req.params;
    //console.log(id)
    const playdate = await Playdate.findById(id);
    if(!playdate.sponser.equals(req.user._id)){
        playdate.participates.push(req.user);
        await playdate.save();
    }
    req.flash('success','Successfully join the playdate!')
    //res.redirect(`/playgrounds/${playground._id}`)
}

module.exports.modifyPlaydate =async(req,res,next)=>{

    const {id,playdateId} = req.params;
    const playground = await Playground.findById(req.params.id);
    console.log(req.body);
    const playdate = await Playdate.findByIdAndUpdate(playdateId,{...req.body.playdate});
    if(playdate.contact==""){
        playdate.contact = req.user.email;
    }
    console.log(playdate);
    //playground.playdates.push(playdate);

    await playdate.save();
    //await playground.save();
    
    req.flash('success','Successfully modify the playdate!')
    res.redirect(`/playgrounds/${playground._id}`)
    // console.log(req.body);
    // const playground = await Playground.findByIdAndUpdate(id,{...req.body.playground})
    // const imgs =  req.files.map(f=>({url:f.path, filename: f.filename}));
    // playground.images.push(...imgs);
    // await playground.save();
    // if (req.body.deleteImages) {
    //     // for (let filename of req.body.deleteImages) {
    //     //     await cloudinary.uploader.destroy(filename);
    //     // }
    //     await playground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    // }
    // req.flash('success','Successfully updated the playground!')
    // res.redirect(`/playgrounds/${playground._id}`)
}



module.exports.deletePlaydate = async(req, res)=>{
    const {id, playdateId} = req.params;
    //use pull to delete the review related in  the playground
    await Playground.findByIdAndUpdate(id, {$pull:{playdates: playdateId}});
    await Playdate.findByIdAndDelete(playdateId);
    req.flash('success','Successfully Cancel the Playdate!')
    res.redirect(`/playgrounds/${id}`);
}