
const User = require('../model/user');
const Post = require('../model/post');
const express = require('express');
const {ensureAuth,ensureGuest} = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const bodyparser = require('body-parser');
const bcrypt=require('bcrypt');
router.use(bodyparser.urlencoded({extended:true}));

// Get Home Page
router.get('/',ensureGuest,(req,res)=>{
    console.log('sshhcs');
    res.render('home');
})

// Get page
router.get('/page', (req,res)=>{
    res.render('page',{
        layout:'page',
    });
})
// Rgister page
router.post('/page',(req,res)=>{
    // res.send(req.body);
    const {error} = validateUser(req.body);
    console.log(error);
    const {email, username, password, confirmpassword} = req.body;
    if(error) {
        res.render('page',{'error':error.details[0].message});
    }
    if(req.body.password !=req.body.password)

    res.render('home');
})

//Post register
router.post('/register',async(req,res)=>{
    console.log(req.body);
    let {error} = validateUser(req.body);
    if(error) {
        res.render('page',{'error':error.details[0].message});
    }
    
    const {email, username, password, confirmpassword} = req.body;
    if(password != confirmpassword){
         error = "Password is not Matching"
         res.render('page',{'error':error});
    }
    
    let user = await User.findOne({email:email});
    if(user)  res.render('page',{'error':'User already Registered !'});

    user = new User({
        email:email,
        username:username,
        password:password,
    });

    // Hashing of password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    res.render('home');
})

// Get Dashboard
router.get('/dashboard',ensureAuth,async(req,res)=>{
  
        const username = req.user.username.charAt(0).toUpperCase() + req.user.username.slice(1); 
        console.log(req.user.id);
        const posts = await Post.find({user:req.user.id}).lean();
        console.log(posts);
   
   
    res.render('dashboard',{
        'name': username,
        posts
    });
}) 
function validateUser(user){
    const schema = {
        email:Joi.string().email(),
        username:Joi.string().required(),
        password:Joi.string(),
        confirmpassword:Joi.string()
    };
    return Joi.validate(user,schema);
}
module.exports = router;