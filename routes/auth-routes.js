const passport = require('passport');
const router = require('express').Router();

//auth login
router.get('/login',(req,res)=>{
    res.render('login')
});

// auth logout
router.get('/logout',(req,res)=>{
  // handle with passport
  console.log('dcsdsvvds');
  req.logout();
  res.redirect('/');
});

// auth with google
router.get('/google',passport.authenticate('google',{
  scope:['email','profile']
}));

// callback route for google to redirect/ callback
router.get('/google/redirect',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
  res.redirect('/dashboard');
})
module.exports=router;