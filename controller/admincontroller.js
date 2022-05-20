const Admin = require('../models/admin');

const alladmins = function (req, res, next) {
    //get all admins
    const permission = req.user.permission;
    Admin.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/permission');
        }
        console.log(result);
        const success = req.flash('success-admin');
        res.render('admins/index', {
            title: 'Admins',
            admins: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    });
}; //all admins 

const Inseradmins = function (req, res, next) {
    const admin = new Admin({
        name: req.body.name,
        type: req.body.type,
        email: req.body.email,
        password: new Admin().encryptPassword(req.body.password),
        permission: {
            addvendors: req.body.addvendors == "addvendors" ? true : false,
            editvendors: req.body.editvendors == "editvendors" ? true : false,
            delvendors: req.body.delvendors == "delvendors" ? true : false,
            addusers: req.body.addusers == "addusers" ? true : false,
            delusers: req.body.delusers == "delusers" ? true : false,
            editusers: req.body.editusers == "editusers" ? true : false,
            adddelevery: req.body.adddeleveries == "adddeleveries" ? true : false,
            editdelevery: req.body.editdeleveries == "editdeleveries" ? true : false,
            deldelevery: req.body.deldeleveries == "deldeleveries" ? true : false,
            editcat: req.body.editcats == "editcats" ? true : false,
            addcat: req.body.addcats == "addcats" ? true : false,
            delcat: req.body.delcats == "delcats" ? true : false,
            orders: req.body.orders == "orders" ? true : false,
            reports: req.body.reports == "reports" ? true : false,
            addnotifications: req.body.notifications == "notifications" ? true : false,
            editcoupns: req.body.editcoupons == "editcoupons" ? true : false,
            addcoupns: req.body.addcoupons == "addcoupons" ? true : false,
            delcoupns: req.body.delcoupons == "delcoupons" ? true : false,
            editlocations: req.body.editlocations == "editlocations" ? true : false,
            addlocations: req.body.addlocations == "addlocations" ? true : false,
            dellocations: req.body.dellocations == "dellocations" ? true : false,
        }
    });
    admin.save((error, result) => {
        if (error) {
            console.log("Error :" + error);
            res.redirect('/admin/permission');
        }
        console.log(result);
        req.flash('success-admin', "done");
        res.redirect('/admin/permission');
    });
}; //Insert Admins

const updateadmins = function (req, res, next) {
    const id = req.body.id;
    const updateadmin = {
        name: req.body.name,
        type: req.body.type,
        email: req.body.email,
        password: new Admin().encryptPassword(req.body.password),
        permission: {
            addvendors: req.body.addvendors == "addvendors" ? true : false,
            editvendors: req.body.editvendors == "editvendors" ? true : false,
            delvendors: req.body.delvendors == "delvendors" ? true : false,
            addusers: req.body.addusers == "addusers" ? true : false,
            delusers: req.body.delusers == "delusers" ? true : false,
            editusers: req.body.editusers == "editusers" ? true : false,
            adddelevery: req.body.adddeleveries == "adddeleveries" ? true : false,
            editdelevery: req.body.editdeleveries == "editdeleveries" ? true : false,
            deldelevery: req.body.deldeleveries == "deldeleveries" ? true : false,
            editcat: req.body.editcats == "editcats" ? true : false,
            addcat: req.body.addcats == "addcats" ? true : false,
            delcat: req.body.delcats == "delcats" ? true : false,
            orders: req.body.orders == "orders" ? true : false,
            reports: req.body.reports == "reports" ? true : false,
            addnotifications: req.body.notifications == "notifications" ? true : false,
            editcoupns: req.body.editcoupons == "editcoupons" ? true : false,
            addcoupns: req.body.addcoupons == "addcoupons" ? true : false,
            delcoupns: req.body.delcoupons == "delcoupons" ? true : false,
            editlocations: req.body.editlocations == "editlocations" ? true : false,
            addlocations: req.body.addlocations == "addlocations" ? true : false,
            dellocations: req.body.dellocations == "dellocations" ? true : false,
        }
    }
    Admin.updateOne({_id: id}, {$set: updateadmin}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/permission');
            return;
        }
        console.log(result);
        req.flash('success-admin', "done");
        res.redirect('/admin/permission');
    });
}; //Update Admins

const deleteadmins = function (req, res, next) {
    const id = req.params.id;
    Admin.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/permission');
            return;
        }
        console.log(result);
        res.redirect('/admin/permission');
    });
}; //Delete

module.exports =
    {
        alladmins,
        Inseradmins,
        updateadmins,
        deleteadmins,
    }