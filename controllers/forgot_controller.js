const User = require("../models/user");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const queue = require('../config/kue');
const fs = require("fs");
const path = require("path");
const Token = require('../models/token');


module.exports.getLinkPage = function (req, res) {
	try{
		// console.log('in forgotPassword');
	return res.render('forgotPassword', {
		title: 'forforgotPasswordgot'
	})
	}
	catch(err){
		console.log('error in get link page', err);
	}
}


module.exports.sendLink = async function(req, res){
    var token = jwt.sign({ foo: 'bar' }, 'codeial');
	let user = await User.findOne({email: req.body.email});
	let newToken = await Token.create({
		user: user._id,
		usersToken: token,
		isValid: true,
	});
	
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        post: 587,
        secure: false,
        auth: {
            user: 'rk152531@gmail.com',
            pass: 'gaerzcvzxoihtdqn'
        }
    });


	var link = `http://localhost:8000/forgot/update-password-page/?accesstoken=${token}&email=${req.body.email}`;
	
    transporter.sendMail({
        from: 'rk152531@gmail.com',
        to: req.body.email,
        subject: 'Forgot Password',
        text: link,
    }, function(err, info) {
        if (err) {
            console.log('Error sending email:', err);
            return;
        }
        console.log('Email sent:', info.response);
    });
	
	return res.redirect('/users/sign-in');
}






module.exports.getPasswordPage = async function(req, res){
	try{
		let token = await Token.findOne({usersToken: req.query.accesstoken});
		if(!token){
			return res.redirect('/users/sign-in');
		}
		return res.render('forgot', {
		title: 'forgot',
		token: req.query.accesstoken
		
	})
	}
	catch(err){
		console.log('error in get paggword page', err);
	}
}

module.exports.setPassword = async function(req, res){
	try{

		
		// console.log(req.body);
		// console.log(req.query.accesstoken);
		if(req.body.password == req.body.confirm_password){

			let token = await Token.findOne({usersToken: req.body.token});
			
			let user = await User.findById(token.user);
			await User.findOneAndUpdate(
				{
					_id:user._id,

				},
				{
					password:req.body.password
				},
				{
					new: true
				}
			);
			// let t = req.body.token;
			let t = await Token.deleteOne({_id:token._id });
			// console.log(t); 

		}
		

	return res.redirect('/users/sign-in');
	}
	catch(err){
		console.log('error in set password', err);
	}	
}


