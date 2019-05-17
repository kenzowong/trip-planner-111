const express = require('express');
const volleyball = require('volleyball');
const path = require('path');
const db = require('./models/db');
const api = require('./api');

//You will add your DB on the next steps:
//const db = require("./models").db;

const app = express();

// logging and body-parsing
app.use(volleyball);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', api);

// static file-serving middleware
app.use(express.static(path.join(__dirname, '..', 'public')));

// catch 404 (i.e., no route was hit) and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// handle any errors
app.use(function(err, req, res, next) {
  console.error(err, err.stack);
  res.status(err.status || 500);
  res.send('Something went wrong: ' + err.message);
});

// listen on a port
const PORT = process.env.PORT || 3000;

const init = async function() {
  await db.sync({});
  app.listen(PORT, function() {
    console.log(`Server is listening on port ${PORT}!`);
  });
};

init();
