const express = require('express');
const app = express();
const port = 8000;

// use express router




//set up the  view engine
// console.log(app.set('view engine', 'ejs'), 'app is ready');
app.set('views', './views') 

app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        //   console.log('Error:', err);

        console.log(`Error in running the server: ${err}`);
    } 

    console.log(`Server is running on port :${port}`);
  
})