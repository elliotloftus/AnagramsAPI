const AnagramSchema = require('../DBSchemas/AnagramSchema');
const helper = require('./helper');

exports.addWords =  async function(req,res) {

    var obj = req.body.words;
    for (var wordToAdd of obj) {
        sorted = helper.sortWord(wordToAdd);

        try  {
            const updatedPost = await AnagramSchema.findOneAndUpdate(
                 {_id: sorted},
                 //addToSet adds the word if it is not already present in array
                 {$addToSet: {words : wordToAdd}},
                 {upsert: true});
         }
         catch(err) {
             return res.status(200).json({message: err});
         }
    }
    return res.sendStatus(201);
};

//Delete entire dictionary
exports.deleteCorpus = async function(req,res) {
    try {
        await AnagramSchema.collection.drop();
    }catch(err) {
        //if the collection does not exist send okay status
        //this is for deleting dictionary multiple times in a row
        if (err.code == 26) {
            return res.sendStatus(204);
        }
        return res.status(500).json({message: err});
    }
    return res.sendStatus(204);
};

//Delete word
exports.deleteWord = async function(req,res) {
    const wordToDelete = req.params.word;
    sorted = helper.sortWord(req.params.word);

    try {
        //findOneAndUpdate return the query before the update take place
        //so wordKey will still have the word we requested to delete in the words array
        const wordKey = await AnagramSchema.findOneAndUpdate(
            {_id: sorted},
            //if the requested word is in words[] delete it
            {$pull :{words : wordToDelete}},
            {$useFindAndModify: false} );  //find and modify is deprecated so set it to false
            

            //This is case if user trys to delete a word that has no matching key
            if(wordKey == null || wordKey.words == null) {
                return res.sendStatus(204);
            }    

            //if the user deletes a word that has no anagrams, delete the key for that word also
            if (wordKey.words.length == 1 && wordKey.words[0] == wordToDelete) {
                AnagramSchema.deleteOne({_id :sorted});
                return res.sendStatus(200);
            }
    }catch(err) {
        console.log(err);
        return res.sendStatus(500);
    }
    return res.sendStatus(204);
};

//add all words from dictionary to mongoDB
/*exports.addDictionary = function(req,res) {
    var fs = require('../test/dictionary');
    fs.readFile('DATA', 'utf8', function(err, words) {
        console.log(words);
    }
}*/
