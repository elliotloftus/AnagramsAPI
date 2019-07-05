const mongoose = require('mongoose');

const AnagramSchema = mongoose.Schema ({

    //sorted word is _id
    //must name it _id for mongodb to assign it to the clustered index 
    //otherwise it will try to automatically generate one
    _id: {
        type: String,
        required: true 
    },
    words: [{
        type: String,
        required: true,
    }]
});

//export this schema
module.exports = mongoose.model('AnagramSchema', AnagramSchema);