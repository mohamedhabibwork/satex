const Order = require('../models/order');

allorders = function (req, res, next) {
    //get all orders
    var permission = req.user.permission;
    var status = req.query.status;
    if (status == "pendingdelevery" || status == "donereceive" || status == "finished" || status == "refused") {
        if (status == "pendingdelevery") {

            Order.find({status: {$in: ['pendingdelevery', 'pendingvendor']}}, (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/orders');
                }
                console.log(result);
                //var show = true;
                result.forEach(function myFunction(item, index) {
                    item.show = true;
                    if (item.status == "finished") {
                        item.show = false;
                    }
                });
                res.render('orders/index', {
                    title: 'Orders',
                    orders: result,
                    permission: permission,
                    layout: 'layout/admin'
                });
            }).populate('trader').populate('delvery'); //sort({createdAt:'asc'}).
        } else if (status == "donereceive") {

            Order.find({status: {$in: ['donereceive', 'accept']}}, (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/orders');
                }
                console.log(result);
                //var show = true;
                result.forEach(function myFunction(item, index) {
                    item.show = true;
                    if (item.status == "finished") {
                        item.show = false;
                    }
                });
                res.render('orders/index', {
                    title: 'Orders',
                    orders: result,
                    permission: permission,
                    layout: 'layout/admin'
                });
            }).populate('trader').populate('delvery'); //sort({createdAt:'asc'}).
        } else {

            Order.find({status: status}, (err, result) => {
                if (err) {
                    console.log(err);
                    res.redirect('/admin/orders');
                }
                console.log(result);
                //var show = true;
                result.forEach(function myFunction(item, index) {
                    item.show = true;
                    if (item.status == "finished") {
                        item.show = false;
                    }
                });
                res.render('orders/index', {
                    title: 'Orders',
                    orders: result,
                    permission: permission,
                    layout: 'layout/admin'
                });
            }).populate('trader').populate('delvery'); //sort({createdAt:'asc'}).
        }


        Order.find({status: status}, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/orders');
            }
            console.log(result);
            //var show = true;
            result.forEach(function myFunction(item, index) {
                item.show = true;
                if (item.status == "finished") {
                    item.show = false;
                }
            });
            res.render('orders/index', {
                title: 'Orders',
                orders: result,
                permission: permission,
                layout: 'layout/admin'
            });
        }).populate('trader').populate('delvery'); //sort({createdAt:'asc'}).

    } else {

        Order.find({}, (err, result) => {
            if (err) {
                console.log(err);
                res.redirect('/admin/orders');
            }
            console.log(result);
            //var show = true;
            result.forEach(function myFunction(item, index) {
                item.show = true;
                if (item.status == "finished") {
                    item.show = false;
                }
            });
            res.render('orders/index', {
                title: 'Orders',
                orders: result,
                permission: permission,
                layout: 'layout/admin'
            });
        }).populate('trader').populate('delvery'); //sort({createdAt:'asc'}).
    }
}; //all orders  


pendingorders = function (req, res, next) {
    //get all orders
    var permission = req.user.permission;
    Order.find({status: "pendingdelevery"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/orders/pending');
        }
        console.log(result);
        res.render('orders/pending', {
            title: 'Orders-Pending',
            orders: result,
            permission: permission,
            layout: 'layout/admin'
        });
    }).populate('delvery');
}; //all orders 


detailsorders = function (req, res, next) {
    //get all orders
    var permission = req.user.permission;
    Order.find({_id: req.params.id}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/orders');
        }
        console.log(result);
        res.render('orders/detail', {
            title: 'Detail-Order',
            orders: result,
            permission: permission,
            layout: 'layout/admin'
        });
    }).populate('delvery').populate('trader').populate('cat');
}; //all orders 

finishorders = function (req, res, next) {
    //get all orders
    Order.updateOne({_id: req.params.id}, {$set: {status: "finished", isfinish: true}}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/orders');
            return;
        }
        console.log(result);
        res.redirect('/admin/orders');
    });
}; //all orders 


finishedorders = function (req, res, next) {
    //get all orders
    var permission = req.user.permission;
    Order.find({status: "finished"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/orders/finished');
        }
        console.log(result);
        res.render('orders/finished', {
            title: 'Orders-Finished',
            orders: result,
            permission: permission,
            layout: 'layout/admin'
        });
    }).populate('trader').populate('delvery');
}; //all orders


cancelorders = function (req, res, next) {
    //get all orders
    var permission = req.user.permission;
    Order.find({status: "cancel"}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/orders/cancel');
        }
        console.log(result);
        res.render('orders/cancel', {
            title: 'Orders-Cancel',
            orders: result,
            permission: permission,
            layout: 'layout/admin'
        });
    }).populate('trader').populate('delvery');
}; //all orders


module.exports =
    {
        allorders: allorders,
        pendingorders: pendingorders,
        finishedorders: finishedorders,
        cancelorders: cancelorders,
        detailsorders: detailsorders,
        finishorders: finishorders
    }