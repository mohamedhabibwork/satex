const Subcat = require('../models/subcat');

allsubcats = function (req, res, next) {
    //get all cats
    Subcat.find({}, 'name cat', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/subcats');
        }
        console.log(result);
        var success = req.flash('success-subcats');
        res.render('subcats/index', {title: 'Subcats', subcats: result, layout: 'layout/admin', success: success});
    });
}; //all subcats  

Insersubcats = function (req, res, next) {
    const subcat = new Subcat({
        name: req.body.name,
        cat: req.body.cat,
    });
    subcat.save((error, result) => {
        if (error) {
            console.log("Error :" + error);
            res.redirect('/admin/subcats');
        }
        console.log(result);
        req.flash('success-subcats', "done");
        res.redirect('/admin/subcats');
    });
}; //Insert subcats

updatesubcats = function (req, res, next) {
    const id = req.body.id;
    const updatesubcat = {
        name: req.body.name,
        cat: req.body.cat,
    }
    Subcat.updateOne({_id: id}, {$set: updatesubcat}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/subcats');
            return;
        }
        console.log(result);
        req.flash('success-subcats', "done");
        res.redirect('/admin/subcats');
    });
}; //Updateuser

deletesubcats = function (req, res, next) {
    const id = req.params.id;
    Subcat.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/subcats');
            return;
        }
        console.log(result);
        res.redirect('/admin/subcats');
    });
}; //Delete


module.exports =
    {
        allsubcats,
        Insersubcats,
        updatesubcats,
        deletesubcats,
    }