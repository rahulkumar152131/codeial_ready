const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');

const cookieParser = require('cookie-parser');
const app = express();

require('./config/view-helpers')(app);

const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

app.use(express.urlencoded());

app.use(cookieParser({extender: flase}));
const db = require('./config/mongoose');
// import db from './config/mongoose';
//use for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy')
const passportGoogle = require('./config/passport-google-auth2-strategy')
// const MongoStore = require('connect-mongo');
var MongoDBStore = require('connect-mongodb-session')(session);
const environment = require('./config/environment');

// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// const sassMiddleware = require('node-sass-middleware');

// app.use(sassMiddleware({
//     src: '/assets/scss',
//     dest: '/assets/css',
//     debug: true,
//     outputStyle: 'expanded',
//     prefix: '/css'
// }));

app.use(express.static(env.asset_path));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(logger(environment.morgan.mode, env.morgan.options));

// use express router

app.use(expressLayouts); 

// extract style and script form sub pages

app.set('layout extractStyles', true);

app.set('layout extractScripts', true);


//set up the  view engine
// console.log(app.set('view engine', 'ejs'), 'app is ready');
app.set('view engine', 'ejs')
app.set('views', './views') 

//mongo store is used to store the session cookie in the db

var store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/codeial_development',
    collection: 'mySessions'
});


app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash)
//use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        //   console.log('Error:', err);

        console.log(`Error in running the server: ${err}`);
    } 

    console.log(`Server is running on port :${port}`);
  
})