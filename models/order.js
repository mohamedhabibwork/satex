const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const orderSchema = mongoose.Schema({
    name: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    delvery: {type: Schema.Types.ObjectId, ref: 'User'},
    trader: {type: Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, required: true},
    statusar: {type: String},
    isfinish: {type: Boolean},
    fatora: {type: Boolean, default: false},
    price: {type: Number, required: true},
    reply: {type: String},
    weight: {type: Number, required: true},
    cat: {type: Schema.Types.ObjectId, ref: 'Cat'},

    username: {type: String, required: true},
    userphone: {type: String, required: true},
    useremail: {type: String, required: true},
    usernotes: {type: String},
    address: {type: String},
    lat: {type: String, required: true},
    lang: {type: String, required: true},
    address2: {type: String, required: true},
    lat2: {type: String, required: true},
    lang2: {type: String, required: true},

    rate: {type: String},
    notes: {type: String},

}, {timestamps: true});
orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);
