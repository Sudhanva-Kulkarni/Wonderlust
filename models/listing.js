const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
    title:{
        type: String
    },
    description: {
        type: String
    },
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFuLZe9UHs6cC_sIBZ8HIqkTg4ADomTdWBcQ&s",
            set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFuLZe9UHs6cC_sIBZ8HIqkTg4ADomTdWBcQ&s" : v
        },
        _id: false
    },
    price:{
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

listingSchema.post("findOneAndDelete", async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;