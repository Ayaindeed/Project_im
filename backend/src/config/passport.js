const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../models');
const User = db.user;
const Etudiant = db.etudiant;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3001/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ 
            where: { googleId: profile.id } 
        });
        
        if (existingUser) {
            return done(null, existingUser);
        }
        
        // Check if user exists with same email
        existingUser = await User.findOne({ 
            where: { email: profile.emails[0].value } 
        });
        
        if (existingUser) {
            // Link Google account to existing user
            existingUser.googleId = profile.id;
            await existingUser.save();
            return done(null, existingUser);
        }
        
        // Create new user
        const newUser = await User.create({
            googleId: profile.id,
            nom: profile.name.familyName || '',
            prenom: profile.name.givenName || '',
            email: profile.emails[0].value,
            role: 'etudiant', // Default role for Google sign-up
            isActive: true
        });
        
        // Create corresponding Etudiant record for student role
        if (newUser.role === 'etudiant') {
            await Etudiant.create({
                userId: newUser.id,
                niveau: 'L3', // Default level
                specialite: 'Non spécifiée'
            });
        }
        
        return done(null, newUser);
    } catch (error) {
        console.error('Error in Google OAuth:', error);
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
