const AnagramSchema = require('../DBSchemas/AnagramSchema');

exports.sortWord = function(word) {
    var wordAsArray = word.toLowerCase().split('');
    return wordAsArray.sort().join('');
}


exports.addWordsToDictionary =  async function(words) {
    console.log(words);
    for (var wordToAdd of words) {
        sorted = this.sortWord(wordToAdd);
        try  {
            await AnagramSchema.updateOne(
                 {_id: sorted},
                 //addToSet adds the word if it is not already present in array
                 {$addToSet: {words : wordToAdd}},
                 {upsert: true});
         }
         catch(err) {
             console.log(err);
         }
    }
}
exports.createDictionary= async function(arr) {
    var map= new Map();
    for (word of arr) {
        const sorted = this.sortWord(word);
        if (!map.has(sorted)) {
            map.set(sorted,[word]);
       }
       else {
           ar = map.get(sorted);
           ar.push(word);
           map.set(sorted,ar);
       }
    }
    return map;
}
