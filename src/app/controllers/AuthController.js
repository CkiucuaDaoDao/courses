const User = require('../models/User.js');
const createError = require('../../util/error.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController{

    register(req, res, next) {
        const salt = bcrypt.genSaltSync(10);
        User.findOne({ username: req.body.username })
            .then(existingUser => {
                if(existingUser){
                    return res.status(400).json({ message: 'Username is already taken' });
                }
                return bcrypt.hash(req.body.password, salt)
            })
            .then((hash) => {
                const newUser = new User({
                    ...req.body,
                    password: hash,
                });
            return newUser.save();
            })
            .then(() => {
                let registrationSuccessful = true;
                if (registrationSuccessful) {
                    return res.json({ message: 'User registered successfully', redirect: '/login' });
                }else{
                    return res.status(400).json({ message: 'Registration failed' });
                }
            })
            .catch(next);     
    }

    login(req, res, next) {
        const user = User.findOne({ username: req.body.username });
        user
            .then(user => {
                if(!user) {
                    return next(createError(404, "User not found!"));
                }
                return bcrypt.compare(req.body.password, user.password);
            })
            .then(isPasswordCorrect  => {
                if(!isPasswordCorrect ) {
                    return next(createError(400, "Wrong password or username!"));
                }
                const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT);
                const { password, isAdmin, ...otherDetails } = user._doc;
                res.cookie("access_token", token, { httpOnly: true })
                    .status(200)
                    .json({details: {...otherDetails}, isAdmin});
            })
            .catch(next);
    }
}

module.exports = new AuthController;
