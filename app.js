var express     = require("express");
var app         = express();

var environment = app.get('env');
var port        = process.env.PORT || 3000;
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var cors        = require('cors');
var mongoose    = require('mongoose');
var routes      = require('./config/routes');



var databaseUrl = process.env.MONGOLAB_URI_MARMALADE || 'mongodb://localhost:27017/locations';
//Chnage from photoframeAPI

console.log(databaseUrl);

mongoose.connect(databaseUrl, {
  useMongoClient: true
});



app.use(morgan('dev'));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

app.use('/api', routes);


app.listen(port, function(){
  console.log('listening on port'+port);
});

module.exports = app