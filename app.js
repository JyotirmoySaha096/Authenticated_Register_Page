//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();


app.use('*/css',express.static("public/css"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields:['password']});

const User = new mongoose.model('User',userSchema);

app.get('/',function(req,res){
    res.render("home");
})

app.get('/login',function(req,res){
    res.render("login");
})

app.get('/register',function(req,res){
    res.render("register");
})

app.post('/register',function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
})

app.post('/login',function(req,res){
    User.findOne({email: req.body.username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser.password === req.body.password){
                res.render("secrets");
            }else{
                res.send("You have entered a wrong information.");
            }
        }
    })
})
app.listen(3000,function(req,res){
    // console.log("App listening to port 3000");
})