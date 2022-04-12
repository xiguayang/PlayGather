const mongoose = require('mongoose');
//add seeds model, . up a level from seeds and up one more level to go to models
const Playground = require('../models/playground');
//add city data from cities.js
const cities = require('./cities');
const sandiegoPlaygrounds = require('./sandiegoPlaygrounds');
const {themes, images,devices} = require('./seedHelpers');


// const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/play-gather';
const dbUrl =  process.env.DB_URL
mongoose.connect(dbUrl,{
//mongoose.connect(dbUrl,{
    useNewUrlParser: true,
   // useCreateIndex:true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//function: given a array, get random element from the array
const sample = array => array[Math.floor(Math.random()*array.length)];
//console.log(sandiegoPlaygrounds.length);
const seedDB = async () => { 
    //await Playground.deleteMany({});
    console.log(sandiegoPlaygrounds.length);
    for(let i = 5; i<sandiegoPlaygrounds.length;i++){
        const newPlaygraound = new Playground({            
        author:'624f2616f153f3fbaea6c795',
        address:`${sandiegoPlaygrounds[i].formatted_address}`,
        title:`${sandiegoPlaygrounds[i].name}`,
        devices:`${sample(devices)}`,
        description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda quo saepe reiciendis explicabo quidem, cumque, fugit unde repellat ullam illum rerum? Dolorem nisi fugit numquam voluptatem iusto! Enim, in doloremque.',
        
        images:[
            {
                url: `${images[i].url}`,
                filename: `${images[i].filename}`,
            },
        ]
        })
    console.log(newPlaygraound);
    await newPlaygraound.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
});