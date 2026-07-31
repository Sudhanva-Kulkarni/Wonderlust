const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { geocodeLocation } = require("../utils/geocode");

const MONGO_URL = process.env.ATLAS_URL; // adjust if you use a different DB name/URL

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const listings = await Listing.find({
        $or: [
            { "geometry.coordinates": [0, 0] },
            { geometry: { $exists: false } }
        ]
    });

    console.log(`Found ${listings.length} listings to geocode`);

    for (const listing of listings) {
        const query = `${listing.location}, ${listing.country}`;
        console.log(`Geocoding: ${query}`);

        const coords = await geocodeLocation(query);

        if (coords) {
            listing.geometry = {
                type: "Point",
                coordinates: [coords.lon, coords.lat]
            };
            await listing.save();
            console.log(`  → Saved [${coords.lon}, ${coords.lat}] for "${listing.title}"`);
        } else {
            console.log(`  → No match found for "${listing.title}" (${query}), skipping`);
        }

        // Nominatim allows max 1 request/second — wait between calls
        await new Promise(resolve => setTimeout(resolve, 1100));
    }

    console.log("Done geocoding existing listings.");
    await mongoose.connection.close();
}

main().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});