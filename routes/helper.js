const AnagramSchema = require('../DBSchemas/AnagramSchema');

exports.sortWord = function(word) {
    var wordAsArray = word.toLowerCase().split('');
    return wordAsArray.sort().join('');
}

