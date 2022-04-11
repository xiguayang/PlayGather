const Playground = require('../models/playground');
const {cloudinary} = require('../cloudinary')

module.exports.index = async(req,res,next)=>{
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index',{playgrounds});
}

module.exports.renderNewForm =(req,res)=>{
    res.render('playgrounds/new');
}

module.exports.createPlayground =async(req,res,next)=>{
    const playground = new Playground(req.body.playground);
    playground.author = req.user._id;
    console.log(req.files);
    playground.images = req.files.map(f=>({url:f.path, filename: f.filename}));
    //res.send(req.body);
    await playground.save();
    
    req.flash('success','Successfully added a new playground!')
    res.redirect(`/playgrounds/${playground._id}`)
}

module.exports.showPlayground = async(req,res,next)=>{
    const playground = await Playground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path: 'author'
        }
    }).populate(
        {
            path:'playdates',
            populate:{
                path:'sponser',
                path:'paticipates'
            }
        }
    ).populate('author');
    //const playground = await (await Playground.findById(req.params.id).populate('reviews'));
    //console.log(playground)
    if(!playground){
        req.flash('error','Cannot find that campground')
        return res.redirect('/playgrounds')
    }
    res.render('playgrounds/show',{playground})
}

module.exports.renderEdit =async(req,res,next)=>{
    const playground = await Playground.findById(req.params.id);
    if(!playground){
        req.flash('error','Cannot find that playground')
        return res.redirect('/campgrounds')
    }
    res.render('playgrounds/edit', {playground})
}
module.exports.edit =async(req,res,next)=>{
    //res.send('it worked') used for test
    const {id} = req.params;
    console.log(req.body);
    const playground = await Playground.findByIdAndUpdate(id,{...req.body.playground})
    const imgs =  req.files.map(f=>({url:f.path, filename: f.filename}));
    playground.images.push(...imgs);
    await playground.save();
    if (req.body.deleteImages) {
        // for (let filename of req.body.deleteImages) {
        //     await cloudinary.uploader.destroy(filename);
        // }
        await playground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated the playground!')
    res.redirect(`/playgrounds/${playground._id}`)

}
module.exports.delete =async(req, res,next)=>{
    const {id} = req.params;
    await Playground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the playground!')
    res.redirect('/playgrounds')
}
