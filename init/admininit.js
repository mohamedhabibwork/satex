const Admin = require('../models/admin');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sataexpress:sataexpress%402203@cluster0.kkwcw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true}, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('connected');
    }
});

const admin = new Admin({
    name: 'SataExpress',
    imagePath: '/public/Adminlook/images/logo/logo.png',
    email: 'admin@gmail.com',
    phone: '00201206472722',
    whatsapp: '00201206472722',
    gmail: 'admin@gmail.com',
    facebook: 'https://two-tech.net',
    sitepercent: 0,
    vendorpercent: 0,
    deleverypercent: 0,
    password: new Admin().encryptPassword('123456'),
    type: 'admin',
    permission: {
        viewvendors: true,
        addvendors: true,
        viewusers: true,
        addusers: true,
        viewdelevery: true,
        adddelevery: true,
        viewcat: true,
        addcat: true,
        orders: true,
        reports: true,
        viewcity: true,
        addcity: true,
        viewcountery: true,
        addcountery: true,
        viewgovernment: true,
        addgovernment: true,
        addnotifications: true,
        viewcoupns: true,
        addcoupns: true
    },
    date: new Date(),

});

admin.save(async (err, result) => {
    if (err) console.log(err);
    console.log(result)
    mongoose.disconnect();
});