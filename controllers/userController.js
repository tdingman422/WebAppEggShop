const model = require('../models/user');
const egg = require('../models/egg');
const offer = require('../models/offers')

exports.loginPage = (req, res, next) => {
    res.render("./user/login");
}

exports.signupPage = (req, res, next) => {
    res.render("./user/new");
}

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), egg.find({seller: id}), offer.find({offerer: id}).populate("egg", "title")])
    .then(results=>{
        const [user, eggs, offers] = results;
        res.render("./user/profile", {user, eggs, offers});
    })
    .catch(err=>next(err));
}

exports.signup = (req, res, next) => {
    let user = new model(req.body);
    user.save()
    .then(user=>{
        req.flash('success', 'Account Created');
        res.redirect("/users/login")
    })
    .catch(err=>next(err));
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({email: email})
    .then(user=>{
        if(!user){
            req.flash('error', 'Can not find account with that email');
            res.redirect('/users/login');
        } else {
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id;
                    res.redirect('/users/');
                } else {
                    req.flash('error', 'Incorrect Password');
                    res.redirect('/users/login');
                }
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
}

exports.logout = (req, res, next) => {
    req.session.destroy(err=>{
        if(err) 
           return next(err);
        else
            res.redirect('/');  
    });
}