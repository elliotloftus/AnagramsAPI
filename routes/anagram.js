const AnagramSchema = require('../DBSchemas/AnagramSchema');
const helper = require('./helper');


//get the anagrams for a given word
exports.getWords =  async function(req,res) {

    var maxWords = req.query.limit;
    var wordToGet = req.params.word;
    var sorted = helper.sortWord(wordToGet);

    try {
        var anagrams = await AnagramSchema.findOne({_id: sorted});
        if (anagrams == null) {
            return res.status(200).json({'anagrams':[]});
        }

        //if user does not speicfy proper or if they give value of no 
        //or false to proper only add lower case anagrams
        //also we should not add the word requested to the list of anagrams
        if (req.query.proper == null || req.query.proper === 'no' || req.query.proper === 'false') {
            anagrams = anagrams.words.filter(function(item) { 
                return item !== wordToGet && item.charCodeAt(0) >= 97
            })
        }
        //otherwise just do not add the word requested to the list of anagrams
        else {
            anagrams = anagrams.words.filter(function(item) { 
                return item !== wordToGet
            })
        }
        if (maxWords > 0) {
            anagrams = anagrams.slice(0,maxWords);
        }
    }
    catch(err) {
        return res.status(500);
    }
    return res.status(200).json({'anagrams': anagrams});
};

//delete the word and all of its anagrams
exports.deleteWordAndAnagrams = async function(req,res) {

    const wordToDelete = req.params.word;
    const key = helper.sortWord(wordToDelete);

    try {
        const deleted = await AnagramSchema.deleteOne({_id: key});
    }
    catch(err) {
        return res.status(400).json({message:err});
    }
    return res.sendStatus(204);
}

exports.checkAnagrams = async function(req,res) {

    const wordsToCheck = req.body.words;

    //must give more than one word to be an anagram
    if (wordsToCheck == null || wordsToCheck.length <=1) {
        return res.status(200).json({"result":false}); 
    }

    else {

        //get the key of the first word entered
        const sorted = helper.sortWord(wordsToCheck[0]);

        //every word in the request must match the first words key
        //if one key does not match return false
        for (var i = 1;i<wordsToCheck.length;i++) {
            if (helper.sortWord(wordsToCheck[i]) !== sorted) {
                return res.send({"result":false});
            }
        }
    }
    return res.status(200).json({"result":true});
}