const express = require('express');
const path=require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
//require our defined error handler class
const ExpressError = require('./utils_helper/ExpressError');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');


const playgroundRoutes = require('./routes/playgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

//const { render } = require('ejs');


mongoose.connect('mongodb://localhost:27017/play-gather',{
    useNewUrlParser: true,
   // useCreateIndex:true,
    useUnifiedTopology: true,
    //useFindAndModify: false
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", ()=>{
    console.log('Database connected!')
});

const app = express();


app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret:'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionConfig));

app.use(flash());

//passport middleware
//passport.session must behind sessionConfig
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//add flash middleware, if any flash key found, show the flash
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser',async(req,res)=>{
    const user = new User({email:'abbb@gmail.com', username:'ab hhh'})
    const newUser = await User.register(user,'chicken');
    res.send(newUser)
})

app.use('/', userRoutes);
app.use('/playgrounds', playgroundRoutes);
app.use('/playgrounds/:id/reviews', reviewRoutes);



app.get('/',(req,res)=>{
    res.render('home')
})

//* means for every path nothing matched go to call the func
app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) =>{
    const{statusCode=500}=err;
    if(!err.message) err.message='Something went wrong!';
    res.status(statusCode).render('error',{err})
})





app.listen(3000,()=>{
    console.log('Serving on port 3000')
})