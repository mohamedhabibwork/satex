const express = require('express');
const router = express.Router();
const Countery = require('../../models/countery');
const User = require('../../models/user');
const Cat = require('../../models/cat');
const Coupon = require('../../models/coupon');
const Admin = require('../../models/admin');
const Order = require('../../models/order');
const upload = require('../../middleware/upload');
const Banner = require('../../models/banner');
const fs = require('fs');
const mime = require('mime');
const {sign} = require("../../helpers/jwt");

/**
 * This function comment is parsed by doctrine
 * @route GET /counteries
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/counteries', function (req, res, next) {

    Countery.find({}, 'name name_en photo code', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route GET /banners
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/banners', function (req, res, next) {

    Banner.find({}, 'photo', (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,//result ,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route GET /coupons
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/coupons', function (req, res, next) {
    Coupon.find({}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route GET /coupons/{code}
 * @param {string} code.path
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/coupons/:code', function (req, res, next) {
    Coupon.findOne({code: req.params.code}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route GET /locations
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/locations', function (req, res, next) {
    Countery.find({}, 'name lat lang', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route GET /cats
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/cats', function (req, res, next) {

    Cat.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': 'successfully'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /login/{lang}
 * @param {string} lang.path
 * @param {string} phone.body.required
 * @param {string} password.query.required - user's password.
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/login/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    console.log(req.body)
    User.findOne({phone: req.body.phone}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'error': err,
                'meg': 'error'
            });
        }

        if (result) {
            if (!result.validPassword(req.body.password)) {
                return res.status(400).json({
                    'status': false,
                    'meg': lang == 'en' ? 'Password Wrong' : 'كلمة السر خطأ'
                });
            }

            if (result.status == 0) {
                return res.status(400).json({
                    'status': false,
                    'meg': lang == 'en' ? 'wait approve from admin' : 'بانتظار تفعيل حسابكم'
                });
            } else if (result.status == 2) {
                return res.status(400).json({
                    'status': false,
                    'meg': lang == 'en' ? 'You are banned from admin' : 'تم حظر حسابكم تواصل مع الدعم'
                });
            }
            User.updateOne({_id: result._id}, {$set: {token: req.body.token}});
            let token = sign({id: result._id, type: result.type}); //expiresIn : '1d'
            return res.status(200).json({
                'status': true,
                'data': result,
                'token': token,
                'meg': lang == 'en' ? 'login successfully' : 'تم الدخول بنجاح'
            });
        } else {
            //check email
            return res.status(400).json({
                'status': false,
                'meg': 'User Not Found'
            });
        }
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /signup-mobile/{lang}
 * @param {string} lang.path
 * @param {string} phone.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/signup-mobile/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    User.findOne({phone: req.body.phone}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        if (result) {
            return res.status(200).json({
                'status': false,
                'meg': lang == 'en' ? 'Phone is already found' : 'رقم الهاتف موجود من قبل'
            });
        }

        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'Success Verify Your Number' : 'برجاء تفعيل '
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /signup-verify-mobile/{lang}
 * @param {string} lang.path
 * @param {string} code.body.required
 // * @param {string} phone.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/signup-verify-mobile/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    if (req.body.code == '123456') {
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'mobile phone verify successfully' : 'تم التفعيل بنجاح'
        });
    } else {
        return res.status(200).json({
            'status': false,
            'meg': 'code wrong'
        });
    }
});
/**
 * This function comment is parsed by doctrine
 * @route POST /signup-complete/{lang}
 * @param {string} lang.path
 * @param {string} email.body.required - email - eg: user@domain
 * @param {string} password.query.required - user's password.
 * @param {string} type.query.required - user's type
 * @param {string} email.query.required - user's email
 * @param {string} phone.query.required - user's phone
 * @param {string} countery.query.required - user's countery
 * @param {string} birthday.query.required - user's birthday
 * @param {string} gender.query.required - user's gender
 * @param {string} token.query.required - user's token
 * @param {string} address.query.required - user's address
 * @param {string} lat.query.required - user's lat
 * @param {string} lat.query.required - user's lat
 * @param {file} image.query.required - user's lat
 * @param {file} image1.query.required - user's lat
 * @param {file} image2.query.required - user's lat
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/signup-complete/:lang?', function (req, res, next) { //upload.array('images[]',3)
    const lang = req.params.lang;
    //   return res.status(200).json({
    //         'status' : true ,
    //         'data'   : req.body ,
    //         'meg'    : 'done'
    //     });
    User.findOne({email: req.body.email}, (err, result) => {
        if (err) {
            return res.status(500).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        if (result) {
            return res.status(200).json({
                'status': false,
                'meg': lang == 'en' ? 'Email is already found' : 'الايميل موجود من قبل'
            });
        }

        const user = new User({
            name: req.body.name,
            type: req.body.type,
            email: req.body.email,
            phone: req.body.phone,
            countery: req.body.countery,
            status: req.body.type == "user" ? 1 : 0,
            birthday: req.body.birthday,
            gender: req.body.gender,
            password: new User().encryptPassword(req.body.password),
            token: req.body.token,
            address: req.body.address,
            lat: req.body.lat ? req.body.lat : 0,
            lang: req.body.lang ? req.body.lat : 0,
        });
// 	if(req.file){
// 	    user.images = req.file.path;
// 	}
        /* if(req.files){
             let path = '';
             req.files.forEach(function(files,index,arr){
                 path = path + files.path + ',';
             });
             path = path.substring(0,path.lastIndexOf(","));
             user.images = path;
         } */

        if (req.body.image) {
            let readfile = Buffer.from(req.body.image, 'base64');
            var path = "./uploads/" + Date.now() + "imag1";
            fs.writeFileSync(path, readfile, 'utf8');
            user.image = path;
        }
        if (req.body.image1) {
            let readfile = Buffer.from(req.body.image1, 'base64');
            var path = "./uploads/" + Date.now() + "imagone";
            fs.writeFileSync(path, readfile, 'utf8');
            user.image1 = path;
        }
        if (req.body.image2) {
            let readfile = Buffer.from(req.body.image2, 'base64');
            var path = "./uploads/" + Date.now() + "imagtwo";
            fs.writeFileSync(path, readfile, 'utf8');
            user.image2 = path;
        }
        user.save().then(result => {
            let token = sign({id: user._id, type: user.type});//expiresIn : '1h'
            return res.status(200).json({
                'status': true,
                'data': result,
                'token': token,
                'meg': lang == 'en' ? 'Successfully signup' : 'تم بنجاح'
            });
        }).catch(err => {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /request-price/{lang}
 * @param {string} lang.path
 * @param {string} meter.body.required
 * @param {string} coupon.body.required
 // * @param {string} phone.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/request-price/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    const meter = req.body.meter;
    const coupon = req.body.coupon;
    let subtract = 0;
    Coupon.findOne({code: coupon}, (err, result) => {
        if (result) {
            subtract = result.price;
        }
    });
    //const weight = req.user.weight;
    Admin.findOne({email: "admin@gmail.com"}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        const price = (meter / 1000) * result.vendorpercent;
        return res.status(200).json({
            'status': true,
            'data': price - subtract,
            'meg': lang == 'en' ? 'done' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /trace-order/{lang}
 * @param {string} lang.path
 * @param {string} order.body.required
 // * @param {string} phone.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/trace-order/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    const order = req.body.order;
    Order.find({$or: [{_id: order}, {userphone: order}]}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'data': result,
            'meg': lang == 'en' ? 'done' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /forget-pass/{lang}
 * @param {string} lang.path
 * @param {string} phone.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/forget-pass/:lang?', function (req, res, next) {
    const lang = req.params.lang;
    User.findOne({phone: req.body.phone}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        if (!result) {
            return res.status(200).json({
                'status': false,
                'meg': lang == 'en' ? 'Phone is not found' : 'رقم الهاتف غير موجود'
            });
        }

        User.updateOne({phone: req.body.phone}, {$set: {password: new User().encryptPassword(req.body.password)}}, (err, result) => {
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'done' : 'تم بنجاح'
            });
        });
    });
});


module.exports = router;