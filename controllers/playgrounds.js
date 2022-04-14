const Playground = require('../models/playground');
const {images,devices} = require('../seeds/seedHelpers');
//const {cloudinary} = require('../cloudinary')
const fetch = require('node-fetch');
module.exports.index = async(req,res,next)=>{
    const playgrounds = await Playground.find({});
    res.render('playgrounds/index',{playgrounds});
}

module.exports.listPlayground = async(req,res,next)=>{
    const {addr} = req.query;
    //console.log(addr);
    const playgrounds = await Playground.find({zip:addr});
    res.render('playgrounds/index',{playgrounds});
}

module.exports.renderNewForm =(req,res)=>{
    res.render('playgrounds/new');
}

module.exports.createPlayground =async(req,res,next)=>{
    const playground = new Playground(req.body.playground);
    playground.author = req.user._id;
    //console.log(req.files);
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
                path:'sponsor',
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
    //console.log(req.body);
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

module.exports.searchPlaygrounds = async(req,res,next)=>{
    //console.log(req.body.location);
    const location = req.body.location.trim();

    url = process.env.GOOGLE_MAP_SEARCH+location+"&key="+process.env.GOOGLE_MAP_API_KEY
    try{
        const obj = await (await fetch(url)).json();
        const results=obj["results"];
        
        for (let i = 0; i < results.length; i++) {
            let result = results[i]
            //ocnsole.log(result);
            const filter = {
                place_id: result['place_id'],
                title:result['name']
            }
            let zipvalue = result.formatted_address.match(/,\s\w{2}\s(\d{5})/);
            if(zipvalue){
                zipvalue=zipvalue[1]
            }else {
                zipvalue="00000";
            } 
            const update={            
                author:'624f2616f153f3fbaea6c795',
                address:result['formatted_address'],
                place_id:result['place_id'],
                title:result['name'],
                description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda quo saepe reiciendis explicabo quidem, cumque, fugit unde repellat ullam illum rerum? Dolorem nisi fugit numquam voluptatem iusto! Enim, in doloremque.',
                images:[
                    {
                        url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180833/PlayGather/uu5rn9tnf9vout5c5jf8.jpg',
                        filename: 'PlayGather/uu5rn9tnf9vout5c5jf8',    
                    },
                ],
                zip:zipvalue
            }
            await Playground.findOneAndUpdate(
                filter,                 // find a document with that filter
                {$setOnInsert:update},// document to insert when nothing was found
                { upsert: true, new: true, runValidators: true }
            )
        }

    }catch(e){
        console.log(e)
    }

    res.redirect(`/playgrounds/search?addr=${location}`)
}

