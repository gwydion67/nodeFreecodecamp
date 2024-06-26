require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

let Person;

const personSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  favoriteFoods: {
    type: [String]
  }
});

Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  let per1 = new Person({
    name: 'abc',
    age: '20',
    favoriteFoods: ['a','b','c']
  });

  per1.save().then((doc) => {
    console.log(doc);
    done(null ,doc);
  }).catch((err) => {
      done(null,err);
      console.log(err);
    })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople).then((doc) => {
    console.log(doc);
    done(null,doc);
  }).catch((err)=> {
      done(null,err);
      console.log(err);
    })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}).then((data)=> {
    console.log(data);
    done(null,data)
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}).then((data) => {
    console.log(data);
    done(null,data)
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id : personId}).then((data) => {
    console.log(data);
    done(null,data);
  }).catch((err)=> {
      console.log(err);
    })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
 
  let per;
  Person.findById({_id: personId}).then((data) => {
    data.favoriteFoods?.push(foodToAdd);
    data.save().then((doc) => {
      console.log('doc',doc);
      done(null,doc)
    }).catch((err) => {
        console.log(err);
      })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName},{age: 20},{"new": true,useFindAndModify: false}).then((doc) => {
    console.log(doc);
    done(null,doc)
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove({_id: personId}).then((data) => {
    done(null,data)
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}).then((data)=> {
    done(null,data);
  }) 
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  
  Person.find({favoriteFoods: foodToSearch}).sort({name: 1}).limit(2).select({age: 0}).exec((err,data) => done(err,data))
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
