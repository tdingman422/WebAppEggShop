const egg = require('../models/egg');
const offer = require('../models/offers');
const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    egg.findById(id)
    .then(egg=>{
        if(egg) {       
            return next();
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.validateOfferId = (req, res, next) => {
    let id = req.params.offerId;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Offer id');
        err.status = 400;
        return next(err);
    }

    offer.findById(id)
    .then(offer=>{
        if(offer) {       
            return next();
        } else {
            let err = new Error('Cannot find an offer with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.validateSignUp = [
    body('firstName', 'First name can not be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name can not be empty').notEmpty().trim().escape(),
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
]

exports.validateLogIn = [
    body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
]

exports.validateEgg = [
    body('title', 'Title can not be empty').notEmpty().trim().escape(),
    body('condition', 'Condition can not be empty and must be an allowed value').notEmpty().isIn(["Good", "Great", "New", "Bad", "Other"]).trim().escape(),
    body('price', 'Price can not be negative or empty').notEmpty().isFloat({min: 0.01}).trim().escape(),
    body('details', 'Details can not be empty').notEmpty().trim().escape()
]

exports.validateOffer = [
    body('amount', 'Amount can not be negative or empty').notEmpty().isFloat({min: 0.01}).trim().escape()
]

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        res.redirect('back');
    } else {
        return next();
    }
}
