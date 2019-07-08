const mongoose = require('mongoose');
const wordsRoute = require('./routes/words');
const anagramRoute = require('./routes/anagram');

const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv/config')
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(cors());

//Connect to MongoDB
mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true },
    function(err) {
        if (err) {
            console.log(err);
        }
    });


/* Api To Add json array of words to dictionary
* 
* Example Request
* $ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/words.json 
* 
*  Sucessful Result example
*  HTTP/1.1 201 CREATED
*/

app.post('/words.json',wordsRoute.addWords);


/* Api To get all of the anagrams for a word
*
* Param: word - the word to get anagrams for
* Optional Param: limit -the maximum number of results to return 
* Optional Param: proper=true- proper nouns will also be returned 
* (by default they are proper nouns are not returned)
* 
* Example Request
* $ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/words.json 
* 
*Succesful result example
*   HTTP/1.1 200 OK
*   {
*   anagrams: [
*       "dear",
*       "dare"
*       ]
*   }
*/
app.get('/anagrams/:word.json',anagramRoute.getWords);

/* Api To check if all of the words in a request are anagrams
* 
* Example Request
* $ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/anagrams.json
* 
*Succesful result example
*   HTTP/1.1 200 OK
*   Result = True
*/
app.post('/anagramCheck.json', anagramRoute.checkAnagrams);


/*API to Delete all words in dictionary
*
* Example usage $ curl -i -X DELETE http://localhost:3000/words.json
*
* Succesfull deletion example
*   HTTP/1.1 204 No Content
*/
app.delete('/words.json',wordsRoute.deleteCorpus)


/*  API to delete a single word in the dictionary
*
*   Param: word - word to be deleted
*
*   Example usage $ curl -i -X DELETE http://localhost:3000/words/read.json
*
* Succesful deletion example 
*   HTTP/1.1 204 No Content
*/
app.delete('/words/:word.json',wordsRoute.deleteWord)


/* API to delete a word and all of its anagrams
*
* Param: word - word to be deleted
*
* Example usage $ curl -i -X DELETE http://localhost:3000/words/read.json
* 
* Succesful deletion example 
*   HTTP/1.1 204 No Content
*/

app.delete('/anagrams/:word.json', anagramRoute.deleteWordAndAnagrams);


//Listen to server
app.listen(3000);