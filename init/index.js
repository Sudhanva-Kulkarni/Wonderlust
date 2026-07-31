const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data");

main()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "6a6c384d3e89e82289102c40"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
}
initDB();