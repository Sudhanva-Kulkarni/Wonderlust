const Listing = require("../models/listing");
const { geocodeLocation } = require("../utils/geocode");

module.exports.index = async (req,res)=>{
    let result = await Listing.find({});
    res.render("listings/index.ejs",{result});
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let nl = new Listing(req.body.listings);
    nl.owner = req.user._id;
    nl.image.url = url;
    nl.image.filename = filename;

    const query = `${req.body.listings.location}, ${req.body.listings.country}`;
    const coords = await geocodeLocation(query);

    if (coords) {
        nl.geometry = {
            type: "Point",
            coordinates: [coords.lon, coords.lat]
        };
    }

    await nl.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id);
    if(!result) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{result});
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    listing.title = req.body.listings.title;
    listing.description = req.body.listings.description;
    listing.price = req.body.listings.price;
    listing.location = req.body.listings.location;
    listing.country = req.body.listings.country;

    const query = `${req.body.listings.location}, ${req.body.listings.country}`;
    const coords = await geocodeLocation(query);
    if (coords) {
        listing.geometry = {
            type: "Point",
            coordinates: [coords.lon, coords.lat]
        };
    }

    if(req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image.url = url;
        listing.image.filename = filename;
    }

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect("/listings");
}

module.exports.deleteListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let result = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate:{
            path: "author"
        }
    })
    .populate("owner");
    if(!result) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{result});
}