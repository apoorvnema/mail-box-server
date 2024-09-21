

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mailSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Mail', mailSchema);
