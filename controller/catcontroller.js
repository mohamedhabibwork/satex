const Cat = require('../models/cat');

const allcats = function (req, res, next) {
    //get all cats
    const permission = req.user.permission;
    Cat.find({}, 'name', (err, result) => { // find({where(name : 'ahmed')},select('name email'),callback)
        if (err) {
            console.log(err);
            res.redirect('/admin/cats');
        }
        console.log(result);
        const success = req.flash('success-cat');
        res.render('cats/index', {
            title: 'Cats',
            cats: result,
            permission: permission,
            layout: 'layout/admin',
            success: success
        });
    });
}; //all cats  

const Insercats = function (req, res, next) {
    const cat = new Cat({
        name: req.body.name,
        name_en: req.body.name_en
    });
    cat.save((error, result) => {
        if (error) {
            console.log("Error :" + error);
            res.redirect('/admin/cats');
        }
        console.log(result);
        req.flash('success-cat', "done");
        res.redirect('/admin/cats');
    });
}; //Insert cats

const updatecats = function (req, res, next) {
    const id = req.body.id;
    const updatecat = {
        name: req.body.name,
        name_en: req.body.name_en
    }
    Cat.updateOne({_id: id}, {$set: updatecat}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/cats');
            return;
        }
        console.log(result);
        req.flash('success-cat', "done");
        res.redirect('/admin/cats');
    });
}; //Updateuser

const deletecats = function (req, res, next) {
    const id = req.params.id;
    Cat.deleteOne({_id: id}, (error, result) => {
        if (error) {
            console.log(error);
            res.redirect('/admin/cats');
            return;
        }
        console.log(result);
        res.redirect('/admin/cats');
    });
}; //Delete


module.exports =
    {
        allcats,
        Insercats,
        updatecats,
        deletecats,
    }