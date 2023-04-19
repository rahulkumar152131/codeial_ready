const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1/codeial_delopment');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connection to database MangoDB'));

db.once('open', function() {
  console.log('Connected to Database :: MongoDB');
});

module.exports = db;