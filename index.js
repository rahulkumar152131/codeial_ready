const express = require('express');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');

app.use(express.static('./assets'));

// use express router

app.use(expressLayouts); 

// extract style and script form sub pages

app.set('layout extractStyles', true);

app.set('layout extractScripts', true);


//set up the  view engine
// console.log(app.set('view engine', 'ejs'), 'app is ready');
app.set('view engine', 'ejs')
app.set('views', './views') 

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        //   console.log('Error:', err);

        console.log(`Error in running the server: ${err}`);
    } 

    console.log(`Server is running on port :${port}`);
  
})