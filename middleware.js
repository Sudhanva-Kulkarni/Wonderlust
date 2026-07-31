const Listing = require("./models/listing");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }
    next();
}  

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let result = await Listing.findById(id);
    if(!result.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body);
    if(result.error) {
        let msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body);
    if(result.error) {
        let msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    let { id, reviewId} = req.params;
    let result = await Review.findById(reviewId);
    if(!result.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
