const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    phone: {type: String, required: true},
    email: {type: String, required: true},
    countery: {type: Schema.Types.ObjectId, ref: 'Countery'},
    type: {type: String, required: true},
    status: {type: Number, default: 1},
    password: {type: String, required: true},
    birthday: {type: Date},
    gender: {type: String},
    token: {type: String},
    image: {type: String},
    image1: {type: String},
    image2: {type: String},
    address: {type: String},
    lat: {type: String},
    lang: {type: String},
    wallet: {type: String},
}, {timestamps: true});
userSchema.plugin(mongoosePaginate);

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
