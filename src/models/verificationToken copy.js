const mongoose = require('mongoose');
const Schema = mongoose.Schema

const verificationTokenSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expiredAt: 500
    }
});


module.exports = mongoose.model('verificationToken', verificationTokenSchema);