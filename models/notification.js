const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const notificationSchema = mongoose.Schema({
    title: {type: String, required: true},
    title_en: {type: String, required: true},
    body: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    type: {type: String}

}, {timestamps: true});

notificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Notification', notificationSchema);