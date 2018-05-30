var express     = require("express");
var app         = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy

var environment = app.get('env');
var port        = process.env.PORT || 3000;
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var mongoose    = require('mongoose');
var routes      = require('./config/routes');

require('./models/db');
require('./config/passport');



var routesApi   = require('./models/db');
//Chnage from photoframeAPI







app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

app.use(passport.initialize());

app.use('/api', routes);

app.use((err,req,res,next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong')
})


app.listen(port, function(){
  console.log('listening on port'+port);
});

module.exports = app