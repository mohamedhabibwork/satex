const City = require('../models/city');

allcities = function (req, res, next) {
    //get all cities
    City.find({}, 'name cat', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/cities');
        }
        console.log(result);
        var success = req.flash('success-city');
        res.render('cities/index', {title: 'cities', cities: result, layout: 'layout/admin', success: success});
    });
}; //all cities  

Insercities = function (req, res, next) {
    const city = new City({
        name: req.body.name,
        cat: req.body.cat,
    });
    city.save((error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/cities');
        }
        console.log(result);
        req.flash('success-city', "done");
        res.redirect('/admin/cities');
    });
}; //Insert cities

updatecities = function (req, res, next) {
    const id = req.body.id;
    const updatecity = {
        name: req.body.name,
        cat: req.body.cat,
    }
    City.updateOne({_id: id}, {$set: updatecity}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/cities');
            return;
        }
        console.log(result);
        req.flash('success-city', "done");
        res.redirect('/admin/cities');
    });
}; //Update cities

deletecities = function (req, res, next) {
    const id = req.params.id;
    City.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/cities');
            return;
        }
        console.log(result);
        res.redirect('/admin/cities');
    });
}; //Delete cities


module.exports =
    {
        allcities: allcities,
        Insercities: Insercities,
        updatecities: updatecities,
        deletecities: deletecities
    }