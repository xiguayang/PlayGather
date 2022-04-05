const mongoose = require('mongoose');
//add seeds model, . up a level from seeds and up one more level to go to models
const Playground = require('../models/playground');
//add city data from cities.js
const cities = require('./cities');
const {themes, descriptors,devices} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/play-gather', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//function: given a array, get random element from the array
const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => { 
    //before inserting data, clear the db
    await Playground.deleteMany({});
    for(let i = 0; i<50;i++){
        const random1000= Math.floor(Math.random()*1000);
        //const price = Math.floor(Math.random()*20)+10;
        const newPlaygraound = new Playground({
            author:'6244a275482b97c64ca58a9e',
            address:`${cities[random1000].city}, ${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(themes)}`,
            //image: 'https://source.unsplash.com/collection/9479488',
            devices:`${sample(devices)}`,
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Assumenda quo saepe reiciendis explicabo quidem, cumque, fugit unde repellat ullam illum rerum? Dolorem nisi fugit numquam voluptatem iusto! Enim, in doloremque.',
            images:[
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180833/PlayGather/uu5rn9tnf9vout5c5jf8.jpg',
                    filename: 'PlayGather/uu5rn9tnf9vout5c5jf8',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180833/PlayGather/slukn5fvxbhdk3pb8vto.jpg',
                    filename: 'PlayGather/slukn5fvxbhdk3pb8vto',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180833/PlayGather/j0etdlczrp1qyqbermmh.jpg',
                    filename: 'PlayGather/j0etdlczrp1qyqbermmh',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180833/PlayGather/kvhzg69xdltyem31ou3w.jpg',
                    filename: 'PlayGather/kvhzg69xdltyem31ou3w',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180834/PlayGather/pookzvmcfgvesxitiaha.jpg',
                    filename: 'PlayGather/pookzvmcfgvesxitiaha',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180834/PlayGather/xjvwxwkfx7x6tlzpzrrn.jpg',
                    filename: 'PlayGather/xjvwxwkfx7x6tlzpzrrn',
                },
                {
                    url: 'https://res.cloudinary.com/cloudyangz/image/upload/v1649180834/PlayGather/xipseqzrt6e8aqw02kjc.jpg',
                    filename: 'PlayGather/xipseqzrt6e8aqw02kjc',
                }
            ]
        })
        await newPlaygraound.save();
    }

}

seedDB().then(()=>{
    mongoose.connection.close();
});