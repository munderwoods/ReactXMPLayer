// server/app.js
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');

const app = express();

app.use(cors())

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
//json parser
app.use(bodyParser.json())
// Serve static assets


app.use('/songs', express.static(path.resolve(__dirname, '..', 'public/songs')))
app.use(express.static(path.resolve(__dirname, '..', 'build')))
// Serve our api
app.use('/api', require('./api'))


app.use('/upload/,', function (req, res)  {
  console.log('works');
});



module.exports = app;
