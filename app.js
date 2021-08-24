const postRoute = require('./routes/posts');
const authRoutes = require('./routes/auth-routes');
const mainRoute = require('./routes/index');
const connectDB = require('./config/db');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const express = require('express');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');
const app = express();
 

// Load Config
dotenv.config({ path: './config/.env'})
connectDB();

// Body Parser
app.use(express.urlencoded({ extended:false}))
app.use(express.json())

// Method override
app.use(
    methodOverride(function(req,res){
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
)

// Passport setup
const passportSetup = require('./services/passport-setup');
const { urlencoded } = require('express');

// Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// Handlebars Helper
const {formatDate,stripTags,truncate,editIcon,select} = require('./helpers/hbs');

// handlebars views
app.engine(
    '.hbs', 
    exphbs({
        helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout:'main' ,
    extname: '.hbs'
  })
);
app.set('view engine', '.hbs');

// Session
app.use(session({
    secret:'keyboard',
    resave:false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl : process.env.MONGO_URI})
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Set global var
app.use( function(req,res,next){
    res.locals.user = req.user || null;
    next();
});
//Static Folder
app.use(express.static(path.join(__dirname, 'public'))); 



//Routes
// app.use('/',require('./routes/index'))
app.use('/',mainRoute);
app.use('/auth',authRoutes);
app.use('/posts',postRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT,console.log(`Server running is ${process.env.NODE_ENV} node on port ${PORT}`));