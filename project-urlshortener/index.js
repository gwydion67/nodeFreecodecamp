require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns');

const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

let Url;

const urlSchema = new mongoose.Schema({
  original_url : {
    type: String,
    required: true
  },
  short_url: {
    type: Number
  },
});

Url = mongoose.model("Url", urlSchema);

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req,res,next) => {
  // console.log(req.body);
  let url = req?.body?.url;
  // url = url.includes('//')? url.split('//')[1]: url;
  url = new URL(url).hostname;
  console.log('url',url);

  dns.lookup(url,(err,address,family) => {
    if(err){
      console.log('error in loopup ',err);
      res.json({
        "error" : 'invalid url'
      })
      return;
    }else{
      console.log(address,family);
      next();
    }
  })


},(req,res,next) => {
    let url = req?.body?.url;

    Url.find({address: url}).then((data) => {
      if(data.length > 0){
        res.json(data[0]);
        console.log('url already exists');
        return;
      }
      next();
    })

  },(req,res,next) => {
   
    let count;

    Url.find().sort({short_url: -1}).then((data) => {
      data = data.filter((el) => el.short_url )
      console.log('the data here ', data)
      if(!data){
        count = 0;
        // console.log('error aaya ree ');
      }else{
        // console.log('count is' , data.shortendTo)
        try {
          count = parseInt(data[0].short_url);
          console.log('count yaha pe ', count);
        } catch (k) {
          // console.log('some locha here')
          count = 0;
        }

        res.locals.count = count;
        next();
      }
    })

  },(req,res) => {
   
    let count = res.locals.count;

    console.log("count ",count)
    let entry = new Url({
      original_url: req.body.url,
      short_url: parseInt(count+1)
    })

    entry.save().then((data) => {
      console.log('data',data); 
      res.json(data);
    }).catch((err) => {
        console.log(err);
      })
  })


app.get('/api/shorturl/:num', (req,res) => {

  console.log('num is ',req.params.num)
  let num = req.params?.num;

  if(isNaN(num)){
    res.json({
      "error": "invalid route",
    });
    return;
  }

  num = parseInt(req.params?.num);
  console.log(num)
  Url.find({short_url: num}).then((data) => {
    console.log(data);
    res.redirect(data[0]?.original_url)
    // res.send('status ok')
  })
  // res.send('status ok')
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
