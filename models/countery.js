const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const counterySchema = mongoose.Schema({
    photo: {type: String, required: true},
    name: {type: String, required: true},
    name_en: {type: String, required: true},
    code: {type: String, required: true},
    lat: {type: String, required: true},
    lang: {type: String, required: true},
});
counterySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Countery', counterySchema);
