const User = require('../models/user');
const Fatora = require('../models/fatora');

allusers = function (req, res, next) {
    //get all users
    const permission = req.user.permission;
    let type;
    let type2;
    let delever = false;
    if (req.params.type == 'client') {
        type2 = "user";
        type = 'العملاء';
    } else if (req.params.type == 'traders') {
        type2 = "vendor";
        type = 'التجار';
    } else if (req.params.type == 'deleveries') {
        type2 = "delevery";
        type = 'المندوبين';
        delever = true;
    } else {
        res.redirect('/admin');
    }
    User.find({type: type2}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        console.log(result);
        const success = req.flash('success-user');
        res.render('users/index', {
            title: 'All Users',
            type: type,
            delever: delever,
            users: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    }).sort({createdAt: 'asc'}).populate('countery');
}; //all users


allpending = function (req, res, next) {
    const permission = req.user.permission;
    User.find({status: 0}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/');
        }
        console.log(result);
        const success = req.flash('success-active');
        res.render('users/wait', {
            title: 'Pending',
            users: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    }).sort({createdAt: 'asc'}).populate('countery');

};

Inseruser = function (req, res, next) {
    User.findOne({phone: req.body.phone}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/users/' + req.body.type);
        }
        if (result) {
            console.log('Phone is already found');
            req.flash('registeruser', 'Phone is already found');
            res.redirect('/admin/users/' + req.body.type);
        }

        const user = new User({
            name: req.body.name,
            type: req.body.type,
            email: req.body.email,
            phone: req.body.phone,
            status: 1,
            password: new User().encryptPassword(req.body.password),
            countery: req.body.countery_id,
        });
        user.save((error, result) => {
            if (error) {
                console.log(error);
                res.redirect('/admin/users/' + req.body.type);
            }
            console.log(result);
            req.flash('success-user', "done");
            return res.redirect('/admin/users/' + req.body.type);
        });
    });
}; //Insert User

updateuser = function (req, res, next) {
    const id = req.body.id;
    const updateuser = {
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        wallet: req.body.wallet ? req.body.wallet : 0,
        password: new User().encryptPassword(req.body.password),
        countery: req.body.countery_id,
    }
    User.updateOne({_id: id}, {$set: updateuser}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/');
            return;
        }
        console.log(result);

        // if(req.body.wallet !=  result.wallet || req.body.wallet <  result.wallet) {
        const fatora = new Fatora({
            user: id,
            price: (result.wallet - req.body.wallet),
        });
        fatora.save();
        //}
        req.flash('success-user', "done");
        res.redirect('/admin/users/' + req.body.type);
    });
}; //Updateuser

deleteuser = function (req, res, next) {
    const id = req.params.id;
    User.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/users/' + req.body.type);
            return;
        }
        console.log(result);
        res.redirect('/admin/users/' + req.body.type);
    });
}; //Delete


module.exports =
    {
        allusers: allusers,
        allpending: allpending,
        Inseruser: Inseruser,
        updateuser: updateuser,
        deleteuser: deleteuser
    }