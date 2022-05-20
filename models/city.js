const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const citySchema = mongoose.Schema({
    name: {type: String, required: true},
    cat: {type: Schema.Types.ObjectId, ref: 'Goverment'},

});
citySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('City', citySchema);