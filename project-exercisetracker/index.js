const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}));

// let userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//   },
// })
let userSchema = new mongoose.Schema({
  username: String,
});

let exerciseSchema = new mongoose.Schema({
  user_id: String,
  username: String,
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
  },
  date: String,
});

let User = mongoose.model("User",userSchema);
let Exercise = mongoose.model("Exercise",exerciseSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req,res,next) => {
  let username = req.body?.username;

  User.find({username: username}).exec().then((data) => {
    if(data.length > 0){
      res.json({
        "error" : "user already exists",
        "user" : data
      })
      return;
    }else{
      res.locals.username = username;
      next();
    }
  })
},(req,res) => {
    let username = res.locals.username;
    let entry = new User({
      username,
    })

    entry.save().then((data) => {
      console.log('User Created ', data);
      res.json(data);
    })
  })

app.get('/api/users', (req,res) => {
  User.find().exec().then((data) => {
    res.send(data)
  })
})


app.post('/api/users/:_id/exercises',(req,res,next) => {
  let _id = req.params._id;

  let duration = req.body?.duration;
  
  if(isNaN(duration)){
    res.json({
      "error": "invalid data",
    });
    return;
  }else{
    User.findById(_id).exec().then((data) => {
      console.log('User Found ',data);
      if(data) {
        res.locals.username = data.username;
        next();
      }else{
        throw Error;
      }
    }).catch((error) => {
        console.log('Error ', error);
        res.json({
          "Error": 'user not found'
        })
      })
  }

},(req,res) => {

    let user_id = req.params._id;
    let description = req.body?.description;
    let duration = parseInt(req.body?.duration);
    let date = req.body?.date;
    let username = res.locals.username;

    if(date == '' || !date){
      date = new Date(Date.now()).toISOString().substring(0,10)
      console.log(date, 'now')
    }

    let entry = new Exercise({
      username,
      description,
      duration,
      date : new Date(date).toDateString(),
      user_id,
    })

    entry.save().then((data) => {
      res.json({
        "_id": user_id,
        username,
        date: (new Date(date)).toDateString(),
        duration,
        description,
      });
        console.log('exercise created ',data)
      })
  })


app.get('/api/users/:_id/logs',(req,res) => {
  console.log("logs called \n")

  User.find({_id: req.params._id}).exec().then((data) => {
    let username = data.username;
    let from = req.query?.from || null;
    let to = req.query?.to || null;
    let limit = req.query?.limit || null;
    let _id = req.params?._id;
    
  
    console.log('searching exercises for user')

    Exercise.find({"user_id": _id}).select({description: 1, duration: 1, date: 1,_id: 0}).exec().then((data) => {
      console.log('here is the searched data', data);

      if(from) {
        data = data.filter((el) => {
          return (new Date(el.date)).getTime() > (new Date(from)).getTime()
        })
      }
      if(to) {
        data = data.filter((el) => {
          return (new Date(el.date)).getTime() <= (new Date(to)).getTime()
        })
      }
      if(limit && data.length > limit){
        data = data.splice(parseInt(limit));
      }

      console.log('here is the filtered data', data);
      res.json({
        "_id": _id,
        "username": username,
        "count": data.length,
        "log": data
      })
      
    }).catch((err) => {
        console.error('error in finding exercises',err)
    })

  }).catch((err) => {
      res.json({
        "Error" : err
      })
    })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
