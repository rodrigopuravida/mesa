var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var db = require('./models');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(ejsLayouts);

app.use(express.static(__dirname + '/public'));

app.use('/patrons', require('./controllers/patrons.js'));
app.use('/chefs',require('./controllers/chefs.js'));
app.use('/plates',require('./controllers/plates.js'));

// Home
app.get('/', function(req, res){
         res.render('index');
});

app.listen(3000);