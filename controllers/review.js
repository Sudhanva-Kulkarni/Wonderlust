const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.getReviews = async (req,res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id);
    res.render("./reviews/new.ejs",{result});
}

module.exports.createReview = async (req,res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();    
    result.reviews.push(review);
    await result.save();
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}