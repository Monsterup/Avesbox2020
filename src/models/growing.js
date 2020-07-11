const mongoose = require('mongoose');
const mongoseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const growingSchema = new Schema({
    value: {
        type: Number,
        required: true
    },
    rearingRecord: {
        type: Schema.Types.ObjectId,
        ref: 'RearingRecord',
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps:true});

growingSchema.plugin(mongoseDelete, {deletedAt: true, overrideMethods: 'all'});

module.exports = mongoose.model('Growing', growingSchema);