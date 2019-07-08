const path = require('path');
const fs = require('fs');
const dictPath = path.resolve(__dirname, "./test/dictionary.txt");
const helper = require('./routes/helper');
const AnagramSchema = require('./DBSchemas/AnagramSchema');
require('dotenv/config')
const mongoose = require('mongoose');

//Connect to MongoDB
mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true },
    function(err) {
        if (err) {
            console.log(err);
        }
    });

var arr = fs.readFileSync(dictPath).toString().split('\n')

//create map of words for bulk insert
//bulk insert takes around 4 minutes
var map= new Map();
for (word of arr) {
    const sorted = helper.sortWord(word);
    if (!map.has(sorted)) {
        map.set(sorted,[word]);
   }
   else {
       //dont worry about duplicate words in array because 
       //our text file should not contain duplicates
       ar = map.get(sorted);
       ar.push(word);
       map.set(sorted,ar);
   }
}

//create the model to bulk insert
models = [];
count=0;
for (var entry of map.keys()) {
    //edge case where we don't want to add empty strings
    if (entry === '') {
        continue;
    }  
    count++;
    model = {
        _id: entry,
        words: map.get(entry)};
    models.push(model);
}

AnagramSchema.insertMany(models).then((resp) => {
    console.log("Inserted dictionary to database");
}).catch((err)=>{
    if (err) {
        console.log(err);
    }
});
 