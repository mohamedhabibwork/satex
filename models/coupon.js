const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const couponSchema = mongoose.Schema({
    code: {type: Number, required: true},
    type: {type: String, required: true},
    price: {type: Number, required: true},
    date: {type: Date, required: true},
}, {timestamps: true});
couponSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Coupon', couponSchema);