var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests

var app = express();

// Bootstrap application settings
app.use(express.static('.'));
app.use(bodyParser.json());

app.listen(8000, function(){
  console.log("Server running on port 8000");
});
