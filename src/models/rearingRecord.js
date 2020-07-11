const mongoose = require('mongoose');
const mongoseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const rearingRecordSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    death: {
        type: Number,
        required: true
    },
    reject: {
        type: Number,
        required: true
    },
    growing: {
        type: Number,
        required: true
    },
    feedType: {
        type: String,
        required: true
    },
    feedTotal: {
        type: Number,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rearing: {
        type: Schema.Types.ObjectId,
        ref: 'Rearing',
        required: true
    },
}, {timestamps: true});

rearingRecordSchema.plugin(mongoseDelete, {deletedAt: true, overrideMethods: 'all'});

module.exports = mongoose.model('RearingRecord', rearingRecordSchema);