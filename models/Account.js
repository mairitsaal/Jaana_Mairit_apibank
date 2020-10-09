const Schema = require('mongoose').Schema;
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose.model('Account', Schema({
    number: {type: String, required: true, min: 11, max: 11, unique: true,
        default: function () {
            return process.env.BANK_PREFIX + require('md5')(new Date().toISOString());
        }
    },
    name: {type: String, required: true, min: 2, max: 255, default: 'Main'},
    balance: {type: Number, required: true, min: 0, default: 100000},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    currency: {type: String, required: true, default: 'EUR'}
}, {
    // Transform id to _id
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.id = docOut._id
            delete docOut._id
            delete docOut.__v
            delete docOut.userId
        }
    }
}));