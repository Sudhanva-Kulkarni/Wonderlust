const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data");

main()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner: "6a59f7792ff0fa269b181dd4"
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized successfully");
}
initDB();