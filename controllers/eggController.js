const model = require("../models/egg");
const Offer = require("../models/offers");

exports.index = (req, res, next) => {
    model.find().sort({price: 'asc'})
    .then(eggs=>{
        res.render("./egg/index", {eggs});
    })
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render("./egg/new");
}

exports.create = (req, res, next) => {
    let egg = new model(req.body);
    egg.image = "/images/" + req.file.filename;
    egg.seller = req.session.user;
    egg.save()
    .then((egg)=>res.redirect("./users/"))
    .catch(err=>{
        if(err.name === "ValidationError"){
            err.status = 400;
        }
        next(err)
    });
}

exports.show = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).populate('seller', 'firstName lastName')
    .then(egg=>{
        res.render("./egg/show", {egg})
    })
    .catch(err=>next(err));
}

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id)
    .then(egg=>{
        res.render("./egg/edit", {egg});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let egg = req.body;
    egg.image = "/images/" + req.file.filename;
    let id = req.params.id;

    model.findByIdAndUpdate(id, egg, {runValidators: true})
    .then(egg=>{
        res.redirect("/users/");
    })
    .catch(err=>{
        if(err.name === "ValidationError"){
            err.status = 400;
        }
        next(err)
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id)
    .then(egg=>{
        Offer.find({egg: id})
        .then(offers=>{
            offers.forEach(offer=>{
                Offer.findByIdAndDelete(offer.id)
                .then()
                .catch(err=>next(err));
            })
        })
        .catch(err=>next(err));
        res.redirect('/users/');
    })
    .catch(err=>next(err));
};

exports.search = (req, res) => {
    let searchTerm = req.query.search;
    model.find({$or: [{title: {$regex: searchTerm}}, {details: {$regex: searchTerm}}]}).sort({price: 'asc'})
    .then(results=>res.render("./egg/search", {results}))
    .catch(err=>next(err));
};
