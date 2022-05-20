var express = require('express');
var router = express.Router();
const {check, validationResult} = require('express-validator');
const User = require('../../models/user');
const Order = require('../../models/order');
const Address = require('../../models/address');
const Admin = require('../../models/admin');
var Notification = require("../../models/notification");
const authapi = require('../../middleware/authapi');
const senmessge = require("../../middleware/sendmessage");
const Fatora = require('../../models/fatora');

/**
 * This function comment is parsed by doctrine
 * @route POST /users/create-order/{lang}
 * @param {string} lang.path
 * @param {string} vendorid.body.required
 * @param {string} name.body.required
 * @param {string} weight.body.required
 * @param {string} cat.body.required
 * @param {string} price.body.required
 * @param {string} username.body.required
 * @param {string} userphone.body.required
 * @param {string} useremail.body.required
 * @param {string} usernotes.body.required
 * @param {string} address.body.required
 * @param {string} lat.body.required
 * @param {string} lang.body.required
 * @param {string} address2.body.required
 * @param {string} lat2.body.required
 * @param {string} lang2.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/create-order/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    if (!req.body.vendorid) {
        const order = new Order({
            name: req.body.name,
            user: req.user.id,
            status: "pendingdelevery",
            statusar: "بانتظار رد المندوب",
            weight: req.body.weight,
            cat: req.body.cat,
            price: req.body.price,
            username: req.body.username,
            userphone: req.body.userphone,
            useremail: req.body.useremail,
            usernotes: req.body.usernotes,
            address: req.body.address,
            lat: req.body.lat,
            lang: req.body.lang,
            address2: req.body.address2,
            lat2: req.body.lat2,
            lang2: req.body.lang2,
        });
        order.save().then(result => {
            User.find({type: "delevery"}, "token", (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    result.forEach(function (resu, index, arr) {
                        senmessge(resu.token, "You have new Order | لديك طلب جديد", "open app to see more details |  افتح الطبيق لرؤية الطلب ");
                        var notification = new Notification({
                            title_en: "You have new Order",
                            title: "لديك طلب جديد",
                            body_en: "some one make a new order",
                            body: "قام احد الاشخاص بطلب توصيل جديد",
                            user: resu._id,
                            type: "user"
                        });
                        notification.save();
                    });
                }
            });
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'order created Successfully' : 'تم ارسال الطلب بنجاح'
            });
        }).catch(err => {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        });

    } else {
        const order = new Order({
            name: req.body.name,
            user: req.user.id,
            trader: req.body.vendorid,
            status: "pendingvendor",
            statusar: "بانتظار رد التاجر",
            weight: req.body.weight,
            cat: req.body.cat,
            price: parseInt(req.body.weight) * 10,
            username: req.body.username,
            userphone: req.body.userphone,
            useremail: req.body.useremail,
            usernotes: req.body.usernotes,
            address: req.body.address,
            lat: req.body.lat,
            lang: req.body.lang,
        });
        order.save().then(result => {
            User.findOne({_id: req.body.vendorid}, 'token', (err, result) => {
                if (err) {
                    return res.status(400).json({
                        'status': false,
                        'data': err,
                        'meg': 'error'
                    });
                }
                if (result) {
                    senmessge(result.token, "order send to you | لديك طلب جديد", "open app to see more details | افتح الطبيق لرؤية الطلب");
                }
            });
            var notification = new Notification({
                title_en: "order send to you",
                title: "لديك طلب جديد",
                body_en: "some one make a new order",
                body: "قام احد الاشخاص بطلب توصيل جديد",
                user: req.body.vendorid,
                type: "user"
            });
            notification.save();
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'order created Successfully' : 'تم ارسال الطلب بنجاح'
            });
        }).catch(err => {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        });
    }
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-user/{status}
 * @param {string} status.path.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-user/:status', authapi, function (req, res, next) {
    Order.find({
        user: req.user.id,
        status: req.params.status == "pendingdelevery" ? {$in: ['donereceive', 'pendingdelevery']} : req.params.status
    }, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('trader');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-vendor
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-vendor', authapi, function (req, res, next) {
    Order.find({trader: req.user.id, status: "pendingdelevery"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('user');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-vendor-accept
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-vendor-accept', authapi, function (req, res, next) {
    Order.find({trader: req.user.id, status: "accept", statusar: "تم الموافقة من التاجر"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('delevery');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-vendor-pending
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-vendor-pending', authapi, function (req, res, next) {
    Order.find({trader: req.user.id, status: "pendingvendor"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('user');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-delevery/{status}
 * @param {string} status.path.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-delevery/:status', authapi, function (req, res, next) {
    Order.find({
        delvery: req.user.id,
        status: req.params.status == "accept" ? {$in: ['donereceive', 'accept']} : req.params.status
    }, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('user').populate('trader');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/orders-delevery-pending
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/orders-delevery-pending', authapi, function (req, res, next) {
    Order.find({status: "pendingdelevery"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
    }).populate('user').populate('trader');
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/notifications
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/notifications', authapi, function (req, res, next) {

    Notification.find({user: req.user.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
 * @route GET /users/vendors
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/vendors', authapi, function (req, res, next) {
    User.find({_id: {$ne: req.user.id}, type: "vendor"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
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
 * @route POST /users/request-order-vendor/{lang}
 * @param {string} lang.path
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/request-order-vendor/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.body.id;
    if (req.body.status == 'cancel') {
        Order.updateOne({_id: id}, {$set: {status: "cancel", statusar: "الطلب ملغي"}}, (error, result) => {
            if (error) {
                return res.status(400).json({
                    'status': false,
                    'data': error,
                    'meg': 'error'
                });
            }
            User.findOne({_id: result.user}, "token", (err, rest) => {
                if (rest) {
                    senmessge(rest.token, "vendor Cancel Your Order | المتجر قام بالغاء الطلب", "open app to see more details | افتح الطبيق لرؤية الطلب");
                }
            });
            var notification = new Notification({
                title_en: "vendor Cancel Your Order",
                title: "المتجر قام بالغاء الطلب",
                body_en: "vendor Cancel Your Order",
                body: "المتجر قام بالغاء الطلب",
                user: result.user,
                type: "user"
            });
            notification.save();
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'successfully Cancel order' : 'تم بنجاح'
            });
        });
    } else if (req.body.status == 'accept') {
        Order.updateOne({_id: id}, {
            $set: {
                status: "pendingdelevery",
                statusar: "بانتظار الرد من المندوب"
            }
        }, (error, result) => {
            if (error) {
                return res.status(400).json({
                    'status': false,
                    'data': error,
                    'meg': 'error'
                });
            }
            User.findOne({_id: result.user}, "token", (err, rest) => {
                if (rest) {
                    senmessge(rest.token, "vendor Accept Your Order | المتجر قام بالموافقة علي الطلب", "open app to see more details | افتح الطبيق لرؤية الطلب");
                }
            });
            var notification = new Notification({
                title_en: "vendor Accept Your Order",
                title: "المتجر قام بالموافقة الطلب",
                body_en: "vendor Accept Your Order",
                body: "المتجر قام بالموافقة الطلب",
                user: result.user,
                type: "user"

            });
            notification.save();
            User.find({type: "delevery"}, "token", (err, result) => {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    result.forEach(function (resu, index, arr) {
                        senmessge(resu.token, "You have new Order", "open app to see more details");
                        var notification = new Notification({
                            title: "You have new Order",
                            body: "open app to see more details",
                            user: resu._id,
                        });
                        notification.save();
                    });
                }
            });
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'successfully accept order' : 'تم بنجاح'
            });
        });
    }
});

/**
 * This function comment is parsed by doctrine
 * @route POST /users/request-order-delevery/{lang}
 * @param {string} lang.path
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/request-order-delevery/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.body.id;
    const iddelevery = req.user.id;
    Order.updateOne({_id: id}, {
        $set: req.body.status == "finished" ? {
            status: req.body.status,
            statusar: "الطلب منتهي",
            delvery: iddelevery,
            isfinish: true
        } : {status: req.body.status, statusar: "تم الموافقة من المندوب", delvery: iddelevery}
    }, (error, result) => {
        if (error) {
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }


        /*********************************************/


        if (req.body.status == "finished") {
            Order.findOne({_id: id}, (err, result3) => {
                Admin.findOne({email: "admin@gmail.com"}, (err, result2) => {
                    User.updateOne({_id: iddelevery}, {$inc: {wallet: (result3.price - (result3.price * result2.sitepercent / 100))}}, (error, result) => {
                    });
                });
            });
        }

        /***********************************************/


        User.findOne({_id: result.user}, "token", (err, rest) => {
            if (rest) {
                senmessge(rest.token, "delvery " + req.body.status + " Your Order  | المندوب " + req.body.status + " طلبكم", "open app to see more details | افتح الطبيق لرؤية الطلب");
            }
        });
        var notification = new Notification({
            title: "المندوب " + req.body.status + " طلبكم",
            title_en: "delvery " + req.body.status + " Your Order",
            body: "المندوب " + req.body.status + " طلبكم",
            body_en: "delvery " + req.body.status + " Your Order",
            user: result.user,
            type: "user"
        });
        notification.save();
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully accept order' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /users/request-order-user/{lang}
 * @param {string} lang.path
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/request-order-user/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.body.id;
    const iduser = req.user.id;
    var updateorder = {
        status: req.body.status,
        // statusar : "الطلب ملغي" ,
        rate: req.body.rate,
        notes: req.body.notes
    };

    Order.updateOne({_id: id}, {$set: updateorder}, (error, result) => {
        if (error) {
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }

        User.findOne({_id: result.trader}, "token", (err, rest) => {
            if (rest) {
                senmessge(rest.token, "user " + req.body.status + " Order |  العميل " + req.body.status + " طلبكم", "open app to see more details | افتح الطبيق لرؤية الطلب");
            }
            var notification = new Notification({
                title: "العميل " + req.body.status + " طلبكم",
                title_en: "user " + req.body.status + " Order",
                body: "العميل " + req.body.status + " طلبكم",
                body_en: "user " + req.body.status + " Your Order",
                user: result.trader,
                type: "user"

            });
            notification.save();
        });
        User.findOne({_id: result.delvery}, "token", (err, rest) => {
            if (rest) {
                senmessge(rest.token, "user " + req.body.status + " Order |  العميل " + req.body.status + " طلبكم", "open app to see more details | افتح الطبيق لرؤية الطلب");
            }
            var notification = new Notification({
                title: "العميل " + req.body.status + " طلبكم",
                title_en: "user " + req.body.status + " Order",
                body: "العميل " + req.body.status + " طلبكم",
                body_en: "user " + req.body.status + " Your Order",
                user: result.delvery,
                type: "user"
            });
            notification.save();

        });
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /users/update-profile/{lang}
 * @param {string} lang.path
 * @param {string} name.body.required
 * @param {string} phone.body.required
 * @param {string} gender.body.required
 * @param {string} birthday.body.required
 * @param {string} address.body.required
 * @param {string} lat.body.required
 * @param {string} lang.body.required
 * @group base - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
//////////////////////Update Profile/////////////////////////////////
router.post('/update-profile/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.user.id;
    const updateuser = {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        birthday: req.body.birthday,
        address: req.body.address,
        lat: req.body.lat,
        lang: req.body.lang,
    }
    User.updateOne({_id: id}, {$set: updateuser}, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully Update Profile' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /users/update-email/{lang}
 * @param {string} lang.path
 * @param {string} email.body.required
 * @group Profile - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/update-email/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.user.id;
    const updateuser = {
        email: req.body.email,
    }
    User.updateOne({_id: id}, {$set: updateuser}, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully Update Email' : 'تم بنجاح'
        });
    });
});
/**
 * This function comment is parsed by doctrine
 * @route POST /users/update-password/{lang}
 * @param {string} lang.path
 * @param {string} password.body.required
 * @group Profile - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/update-password/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const id = req.user.id;
    //if(new User().validPassword(req.body.oldpass)){
    const updateuser = {
        password: new User().encryptPassword(req.body.newpass),
    }
    User.updateOne({_id: id}, {$set: updateuser}, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }
        console.log(result);
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully Update Password' : 'تم بنجاح'
        });
    });
    // }else{
    //     return res.status(200).json({
    //         'status' : false ,
    //         'meg'    : 'Old Password wrong'
    //     });
    // }
});

/**
 * This function comment is parsed by doctrine
 * @route POST /users/Add-Addresses/{lang}
 * @param {string} lang.path
 * @param {string} address.body.required
 * @param {string} name.body.required
 * @param {string} email.body.required
 * @param {string} phone.body.required
 * @param {string} lat.body.required
 * @param {string} lang.body.required
 * @group Addresses - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/Add-Addresses/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;
    const names = req.body.address.split('-');

    names.forEach(function (item, index) {


        const address = new Address({
            name: req.body.name.split('-')[index],
            email: req.body.email.split('-')[index],
            phone: req.body.phone.split('-')[index],
            address: item,
            lat: req.body.lat.split('-')[index],
            lang: req.body.lang.split('-')[index],
            user: req.user.id
        });
        address.save().then(result => {
            return res.status(200).json({
                'status': true,
                'meg': lang == 'en' ? 'Successfully Add Address' : 'تم بنجاح'
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
 * @route GET /users/All-Addresses/{lang}
 * @param {string} lang.path
 * @param {string} password.body.required
 * @group Addresses - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/All-Addresses', authapi, function (req, res, next) {

    Address.find({user: req.user.id}, (err, result) => {
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
 * @route GET /users/Edit-Addresses/{lang}
 * @param {string} lang.path
 * @param {string} name.body.required
 * @param {string} email.body.required
 * @param {string} phone.body.required
 * @param {string} address.body.required
 * @param {string} lat.body.required
 * @param {string} lang.body.required
 * @group Addresses - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/Edit-Addresses/:lang?', authapi, function (req, res, next) {
    var lang = req.params.lang;

    const id = req.body.id;
    const updateuser = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        lat: req.body.lat,
        lang: req.body.lang,
    }

    Address.updateOne({_id: id}, {$set: updateuser}, (error, result) => {
        if (error) {
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }
        return res.status(200).json({
            'status': true,
            'meg': lang == 'en' ? 'successfully' : 'تم بنجاح'
        });
    });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/Delete-Addresses/{lang}
 * @param {string} lang.path
 * @group Addresses - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/Delete-Addresses/:id', authapi, function (req, res, next) {

    const id = req.params.id;
    Address.deleteOne({_id: id}, (error, result) => {
        if (error) {
            return res.status(400).json({
                'status': false,
                'data': error,
                'meg': 'error'
            });
        }
        return res.status(200).json({
            'status': true,
            'meg': 'successfully'
        });
    });
});

/**
 * This function comment is parsed by doctrine
 * @route GET /users/wallet/{lang}
 * @param {string} lang.path
 * @group Profile - all
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/wallet', authapi, function (req, res, next) {
    User.findOne({_id: req.user.id}, (err, result) => {
        if (err) {
            return res.status(400).json({
                'status': false,
                'data': err,
                'meg': 'error'
            });
        }
        Fatora.find({user: req.user.id}, (err, fatoras) => {
            return res.status(200).json({
                'status': true,
                'data': result.wallet,
                'data2': fatoras,
                'meg': 'successfully'
            });
        });
    });
});

module.exports = router;