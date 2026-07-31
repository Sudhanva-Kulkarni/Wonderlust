if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

main()
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

// 'mongodb://127.0.0.1:27017/wonderlust'

async function main() {
  await mongoose.connect(process.env.ATLAS_URL);
}

const port = 8000;


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
});

const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionOptions));
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// //root route
// app.get("/", (req,res)=>{
//     res.send("root working");
// })

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

//all listing routes
app.use("/listings", listingRoutes);
//all review routes
app.use("/listings/:id/reviews", reviewRoutes);
//all user routes
app.use("/", userRoutes);

app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error/error.ejs",{err});
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})