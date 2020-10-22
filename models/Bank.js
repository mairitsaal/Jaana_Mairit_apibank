const mongoose = require('mongoose')
require('dotenv').config()

var validateUrl = function(url) {

    var re = /(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{1,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
    ;
    return re.test(url)
};

module.exports = mongoose.model('Bank', new mongoose.Schema({
    name: {type: String, required: true},
    apiKey: {type: String, required: true},
    transactionUrl: {type: String, required: true, validate: validateUrl},
    bankPrefix: {type: String, required: true},
    owners: {type: String, required: true},
    jwksUrl: {type: String, required: true, validate: validateUrl}
}))