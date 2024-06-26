// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get('/api/:date?', (req,res) => {
  let utc,unix, date = req.params?.date;
  console.log('the param for date is : ',date);
  if(!date){
    utc = new Date().toUTCString();
    unix = new Date().getTime();
    res.json({unix,utc});
    return;
  }
  if(!isNaN(date)){
    date = parseInt(req.params?.date);
  }
  utc = new Date(date).toUTCString();
  unix = new Date(date).getTime();
  if(unix) {
    console.log('result: ' ,utc,unix);
    res.json({unix,utc});
  }else{
    res.json({"error": "Invalid Date"});
    console.log('error: ' ,utc,unix);
  }
})



// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
