# Anagrams

This Project has multiple APIs that allow you to interact with anagrams.  See the project live in action here https://gentle-coast-45220.herokuapp.com/

# Running and Testing locally
 
 To run this app locally just make sure to have NodeJS installed and follow these steps. 
 1) clone the repo
 2) npm install to get dependencies
 3) npm start
 
The host url for tests is currently pointing to the deployed backend at peaceful-stream-39279.herokuapp.com, but if you wish to test changes locally just change the host url to localhost and additionally add the port number to whatever port you're running the app on locally. Then run the tests by directing into the test folder and using the command ruby anagram_test.rb.  This will require ruby to be installed.  You will see I added some tests to test the optional features I added. 

If you wish to add the dictionary just type node addDictionary.js from the root directory, this will take about 4 minutes to take the text file and push it to mongoDB.

If you wish to make front end changes checkout the code for the repository here https://github.com/elliotloftus/anagramsAPIFronted


# Implementation

The project was built with an NodeJS express backend and a MongoDB key value store for quick searches to find anagrams.

The app.js file contains the routes for the request to the API, and the anagrams.js and words.js files in the routes folder contain the majority of the logic behind those APIs. 

The main logic behind keeping track of a anagrams is to sort the words for a unique match. The sorted word is stored as the key in the data store, and all its anagrams are stored as an array of words.  For example, for the words "read, dear dare", the data store would look like this.
```
Sorted Key = "ader"
  Words: ["read,"dear","dare"]
```
# Design Consideration

A redis data store would allow for slightly quicker data operations, but I still like the idea of having a database that writes to the disk.  I chose to use mongoose to interact with  mongoDB, vuejs, and Express because they are all very light weight, easy to use, and readable.

# Problems encountered/Edge Cases

My original ingesting of the dictionary took over 2 hours. Luckily I was able to take advantage of MongoDBs bulk inserts and cut that time down to around 4 minutes. It turns out one trip to the database is quite a bit faster than over 200,000.

An edge cases I discovered was to delete a key in the database when that key no longer has any anagrams.


# API Overview

## Endpoint Overview

#### Required
- Post Words: Takes a JSON array of English-language words and adds them to the corpus (data store).
- Get Words
  - Returns a JSON array of English-language words that are anagrams of the word passed in the URL.
  - This endpoint supports an optional query param that indicates the maximum number of results to return.
  - This endpoint supports an optional query param 'proper' that if specified to true will include proper nouns
-  Deletes a single word from the data store.
-  Deletes all contents of the data store.

#### Optionals
- Respect a query param for whether or not to include proper nouns in the list of anagrams
- Endpoint to delete a word *and all of its anagrams*
- Endpoint that takes a set of words and returns whether or not they are all anagrams of each other

## Interacting with API

If interacting with deployed api use this instead of localhost, otherwise use url for where it is deployed locally

```
### Adding words to the corpus
$ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/words.json
HTTP/1.1 201 Created
...

### Checking if words are annagrams
$ curl -i -X POST -d '{ "words": ["read", "dear", "dare"] }' http://localhost:3000/anagramCheck.json
HTTP/1.1 200 OK
   Result = True
...

### Fetching anagrams
$ curl -i http://localhost:3000/anagrams/read.json
HTTP/1.1 200 OK
...
{
  anagrams: [
    "dear",
    "dare"
  ]
}

### Specifying maximum number of anagrams
$ curl -i http://localhost:3000/anagrams/read.json?limit=1
HTTP/1.1 200 OK
...
{
  anagrams: [
    "dare"
  ]
}

###Specifying to include proper nouns
$ curl -i http://localhost:3000/anagrams/Veda.json?proper=true
HTTP/1.1 200 OK
...
{
  anagrams: [
    "Dave"
    "deva"
  ]
}

### Delete single word
$ curl -i -X DELETE http://localhost:3000/words/read.json
HTTP/1.1 204 No Content
...

### Delete all words
$ curl -i -X DELETE http://localhost:3000/words.json
HTTP/1.1 204 No Content
...

### Delete all words and the words anagrams
$ curl -i -X DELETE http://localhost:3000/anagrams/read.json
HTTP/1.1 204 No Content
...

```

