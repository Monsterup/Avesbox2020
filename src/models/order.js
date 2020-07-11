const mongoose = require('mongoose');
const mongoseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    courier: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "1",
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    resi: {
        type: String,
    },
    transferImage: {
        type: String,
    },
    transferName: {
        type: String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {timestamps:true});

orderSchema.plugin(mongoseDelete, {deletedAt: true, overrideMethods: 'all'});

module.exports = mongoose.model('Order', orderSchema);