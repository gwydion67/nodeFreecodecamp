const bodyParser = require('body-parser');
require('dotenv').config();

let express = require('express');
let app = express();

console.log("Hello World");

app.get('/', (req, res) => {
  let absolutePath = __dirname + '/views/index.html';
  res.sendFile(absolutePath);
})

app.use((req, res, next) => {
  let reqMethod = req.method;
  let path = req.path;
  let ip = req.ip;
  console.log(reqMethod + " " + path + " - " + ip);
  next();
 }
)

app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static(__dirname + '/public'))

app.get('/json',(req,res) => {
  let style = process.env.MESSAGE_STYLE;
  console.log(style)
  let msg = "Hello json";
  if (style == "uppercase") {
    msg =  msg.toUpperCase();
  }
  res.json({
    "message" : `${msg}`
  })
})

app.get('/now', (req,res,next) => {
  req.time = (new Date).toLocaleTimeString() + " --- " + (new Date).toLocaleDateString();
  next();
},(req,res) => {
    res.json({
      "time" : req.time,
    })
  })

app.get('/:word/echo', (req,res) => {
  let word = req.params?.word;
  console.log('word:' , word," params: ", req.params);
  res.json({
    "echo": word,
  })
})

app.route('/name').get((req,res) => {
  let fname = req.query?.first;
  let lname = req.query?.last;

  let name = fname + " " + lname;

  res.json({
    name,
  });
}).post((req,res) => {
    let fname = req.body?.first;
    let lname = req.body?.last;
    let name = fname + " " + lname;
    res.json({
      name,
    });
  })



module.exports = app;
