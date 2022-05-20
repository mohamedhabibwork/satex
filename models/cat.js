const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const catSchema = mongoose.Schema({
    name: {type: String, required: true},
    name_en: {type: String, required: true},
    photo: {type: String},
});

catSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Cat', catSchema);