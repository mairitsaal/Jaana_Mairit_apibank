const mongoose = require('mongoose');

module.exports = mongoose.model('Session', mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
}, {
    // Transform id to _id
    toJSON: {
        transform: (docIn, docOut) => {
            docOut.token = docOut._id
            delete docOut._id
            delete docOut.__v
        }
    }
}))

