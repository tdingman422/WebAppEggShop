const egg = require('../models/egg');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if(!req.session.user) {
        return next();
    } else {
        req.flash('error', 'Already logged in');
        return res.redirect('/users/profile');
    }
}

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user) {
        return next();
    } else {
        req.flash('error', 'Not logged in');
        return res.redirect('/users/login');
    }
}

//check if user is poster of egg
exports.isSeller = (req, res, next) => {
    let id = req.params.id;

    egg.findById(id)
    .then(egg => {
        if(egg.seller == req.session.user){
            return next();
        } else {
            let err = new Error('Unathorized to access resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
}

//check if user is not poster of egg
exports.isNotSeller = (req, res, next) => {
    let id = req.params.id;
    
    egg.findById(id)
    .then(egg => {
        if(egg.seller != req.session.user){
            return next();
        } else {
            let err = new Error('Unathorized to access resource');
            err.status = 401;
            return next(err);
        }
    })
    .catch(err=>next(err));
}