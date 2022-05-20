const Goverment = require('../models/goverment');

allgoverments = function (req, res, next) {
    //get all countries
    Goverment.find({}, 'name cat', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/goverments');
        }
        console.log(result);
        var success = req.flash('success-goverments');
        res.render('goverments/index', {
            title: 'Goverments',
            goverments: result,
            layout: 'layout/admin',
            success: success
        });
    });
}; //all countries  

Insergoverments = function (req, res, next) {
    const goverment = new Goverment({
        name: req.body.name,
        cat: req.body.cat,
    });
    goverment.save((error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/goverments');
        }
        console.log(result);
        req.flash('success-goverments', "done");
        res.redirect('/admin/goverments');
    });
}; //Insert goverments

updategoverments = function (req, res, next) {
    const id = req.body.id;
    const updategoverment = {
        name: req.body.name,
        cat: req.body.cat,
    }
    Goverment.updateOne({_id: id}, {$set: updategoverment}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/goverments');
            return;
        }
        console.log(result);
        req.flash('success-goverments', "done");
        res.redirect('/admin/goverments');
    });
}; //Update goverments

deletegoverments = function (req, res, next) {
    const id = req.params.id;
    Goverment.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/goverments');
            return;
        }
        console.log(result);
        res.redirect('/admin/goverments');
    });
}; //Delete goverments


module.exports =
    {
        allgoverments: allgoverments,
        Insergoverments: Insergoverments,
        updategoverments: updatecountery,
        deletegoverments: deletegoverments
    }