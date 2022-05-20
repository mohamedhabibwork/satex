const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const addressSchema = mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    address: {type: String, required: true},
    lat: {type: String},
    lang: {type: String},
    user: {type: Schema.Types.ObjectId, ref: 'User'},

}, {timestamps: true});

addressSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Address', addressSchema);