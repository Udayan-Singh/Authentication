//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const md5 = require('md5');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});
}

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", (req,res) => {
    res.render("home");
})

app.get("/login", (req,res) => {
    res.render("login");
})

app.get("/register", (req,res) => {
    res.render("register")
})

app.post("/register",async (req,res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    await newUser.save().then( () => {
        res.render("secrets");
    }).catch(err => {
        console.log(err);
    })
})

app.post("/login", async (req,res) => {
    const username = req.body.username;
    const password = md5(req.body.password);

    await User.findOne({email: username}).then( (foundUser) => {
        if(foundUser) {
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
})


app.listen(3000, () => {
    console.log("Server started on port 3000");
})