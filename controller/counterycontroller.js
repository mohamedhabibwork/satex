const Countery = require('../models/countery');

allcounteries = function (req, res, next) {
    //get all countries
    var permission = req.user.permission;
    Countery.find({}, (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/countries');
        }
        console.log(result);
        var success = req.flash('success-countery');
        res.render('countries/index', {
            title: 'Counteries',
            countries: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    });
}; //all countries  

Insercountery = function (req, res, next) {
    const countery = new Countery({
        name: req.body.name,
        name_en: req.body.name_en,
        code: req.body.code,
        lat: req.body.lat,
        lang: req.body.lang
    });


    if (req.file) {
        countery.photo = req.file.path;
    }
    countery.save((error, result) => {
        if (error) {
            console.log("Error :" + error);
            res.redirect('/admin/countries');
        }
        console.log(result);
        req.flash('success-countery', "done");
        res.redirect('/admin/countries');
    });
}; //Insert User

updatecountery = function (req, res, next) {
    const id = req.body.id;
    const updatecountery = {
        name: req.body.name,
        name_en: req.body.name_en,
        code: req.body.code,
        lat: req.body.lat,
        lang: req.body.lang
    }
    Countery.updateOne({_id: id}, {$set: updatecountery}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/countries');
            return;
        }
        console.log(result);
        req.flash('success-countery', "done");
        res.redirect('/admin/countries');
    });
}; //Updateuser

deletecountery = function (req, res, next) {
    const id = req.params.id;
    Countery.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/countries');
            return;
        }
        console.log(result);
        res.redirect('/admin/countries');
    });
}; //Delete


module.exports =
    {
        allcounteries: allcounteries,
        Insercountery: Insercountery,
        updatecountery: updatecountery,
        deletecountery: deletecountery
    }
