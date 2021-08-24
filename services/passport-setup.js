const User = require('../model/user');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();

passport.serializeUser((user,done) =>{
    done(null,user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
         done(null,user);
    });
});

passport.use(
    new GoogleStrategy({
        //options for the google strategy.
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    },async(accessToken,refreshToken,profile,done)=>{
        //passport callback function
        console.log('passport callback function fired');
        console.log(profile._json.sub);

        const user = await User.findOne({googleId:profile.id});
        if(user) {
            // user already exits
            console.log('user exited is:',user);
            done(null,user);
        }else{
            const new_user = new User({
                username:profile.displayName.charAt(0).toUpperCase()+profile.displayName.slice(1),
                googleId:profile.id,
            });
            new_user.save();
            console.log('New user created:', new_user);
            done(null,new_user);
        }
    })
);