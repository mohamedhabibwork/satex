const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const bannerSchema = mongoose.Schema({
    photo: {type: String},
}, {timestamps: true});
bannerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Banner', bannerSchema);