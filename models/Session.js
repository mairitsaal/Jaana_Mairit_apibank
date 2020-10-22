const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
require('dotenv').config()


module.exports = mongoose.model('Session', mongoose.Schema ({

    userId: {type: Schema.Types.ObjectId, ref: 'User'}
}, {
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.token = docOut._id
            delete docOut._id
            delete docOut.__v
            delete docOut.userId
        }
    }
}));