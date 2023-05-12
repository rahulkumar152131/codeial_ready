const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const queue = require('../../../config/kue');
const env = require('../../../config/environment');

const ejs = require('ejs');
const path = require('path');

module.exports.createSession = async function (req, res) {
    try{
        let user = await User.findOne({email: req.body.email});
        if(!user || user.password != req.body.password){
            console.log('In create session', user);
            return res.status(422).json({
                message: 'Invalid username or password'
            });
        }

            return res.status(200).json({
                message: 'Sign in successful here is your token, please keep it safe',
                data:{
                    token:jwt.sign(user.toJSON(), env.jwt_secret, {expiresIn: '100000'})
                }
            })
        }
     
    catch(err){
        console.log(err);
        // req.flash('error', err);
        return res.status(500).json({
            message: 'internal serer error'
        });
    }  
}


