const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const govermentSchema = mongoose.Schema({
    name: {type: String, required: true},
    cat: {type: Schema.Types.ObjectId, ref: 'Countery'},

}, {timestamps: true});
govermentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Goverment', govermentSchema);