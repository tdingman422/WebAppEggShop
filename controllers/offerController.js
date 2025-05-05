const model = require("../models/offers");
const Egg = require("../models/egg");

exports.create = (req, res, next) => {
    let offer = new model(req.body);
    offer.offerer = req.session.user;
    offer.egg = req.params.id;
    offer.save()
    .then(offer=>{
        Egg.findByIdAndUpdate(offer.egg, {$inc: {totalOffers: 1}, $max: {highestOffer: offer.amount}}, {runValidators: true})
        .then(egg=>res.redirect("back"))
        .catch(err=>next(err));
    })
    .catch(err=>{
        next(err);
    });
}

exports.show = (req, res, next) => {
    const id = req.params.id;
    Promise.all([model.find({egg: id}).populate("offerer egg", "firstName lastName active"), Egg.findById(id)])
    .then(results=>{
        let [offers, egg] = results;
        res.render("./offer/offers", {offers, egg})
    })
    .catch(err=>next(err));
}

exports.accept = (req, res, next) => {
    const id = req.params.offerId;
    model.findByIdAndUpdate(id, {status: "accepted"})
    .then(acceptedOffer=>{
        console.log(acceptedOffer);
        model.find({egg: req.params.id})
        .then(offers=>{
            offers.forEach(offer=>{
                console.log(offer.id);
                if(offer.id !== acceptedOffer.id){
                    console.log("Not accepted");
                    model.findByIdAndUpdate(offer.id, {status: "rejected"})
                    .then()
                    .catch(err=>next(err));
                }
            })
        })
        .catch(err=>next(err));
    })
    .catch(err=>next(err));

    Egg.findByIdAndUpdate(req.params.id, {active: false})
    .then(res.redirect("back"))
    .catch(err=>next(err));
}