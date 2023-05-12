const { response } = require("express");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const Friendship = require('../models/friendship');
module.exports.profile = async function (req, res) {
	// return res.render('user_profile', {
	//     title:'Home',
	// });

	// if(req.cookies.user_id){
	//     User.findById(req.cookies.user_id, function(user, err){

	//         if(user){
	//             return res.render('user_profile', {
	//                 title:'User Profile',
	//                 user: user
	//             })
	//         }
	//         return res.redirect('/users/sign-in');

	//     })
	// }else{
	//     return res.redirect('/users/sign-in')
	// }

	// // if(req.cookies.user_id){
	// //     User.findById(req.cookies.user_id)
	// //       .then(function(user) {
	// //         if(user) {
	// //           return res.render('user_profile', {
	// //             title: 'User Profile',
	// //             user: user
	// //           });
	// //         }
	// //         return res.redirect('/users/sign-in');
	// //       })
	// //       .catch(function(err) {
	// //         // handle error
	// //       });
	// //   } else {
	// //     return res.redirect('/users/sign-in');
	// //   }


	// try {
	// 	let user = await User.findById(req.params.id);
	// 	// console.log(user);
	// 	return res.render("user_profile", {
	// 		title: "User Profile",
	// 		profile_user: user,
	// 	});
	// } catch (err) {
	// 	console.log('error in getting profile', err);
	// 	return;
	// }


	try {
		let profile_user = await User.findById(req.params.id);
		let sourceToDestination = await Friendship.findOne({
		  from_user: req.user._id,
		  to_user: req.params.id,
		});
		let destinationToSource = await Friendship.findOne({
		  from_user: req.params.id,
		  to_user: req.user._id,
		});
		let displayText;
		if (sourceToDestination || destinationToSource) {
		  displayText = "Remove Friend";
		} else {
		  displayText = "Add Friend";
		}
		return res.render("./user_profile", {
		  title: "User Profile",
		  profile_user: profile_user,
		  displayText: displayText,
		});
	  } catch (error) {
		console.log("Error in finding the profile");
	  }
};

module.exports.update = async function (req, res) {
	// try{
	// 	console.log(req.user.id == req.params.id);
	//     if (req.user.id == req.params.id) {
	//         console.log(    await User.findByIdAndUpdate(req.params.id, req.body));
	//             return res.redirect("back");

	//     } else {
	//         return res.status(401).send("Unauthorised");
	//     }
	// }
	// catch(err){
	//     console.log('error', err);

	// }

	try {
		if (req.user.id == req.params.id) {
			let user = await User.findById(req.params.id);
			// console.log(user);
			User.uploadedAvater(req, res, async function (err) {
				if (err) {
					console.log("****Multer Error", err);
					return;
				}
				user.name = req.body.name;
				let email = await User.findOne({ email: req.body.email });
				if(!email){
					user.email = req.body.email;
				}
				user.password = req.body.password;
				if (req.file) {
					if (user.avatar) {
						if(fs.existsSync(path.join(__dirname, "..", user.avatar))){
							fs.unlinkSync(path.join(__dirname, "..", user.avatar));
						}
						
					}

					//this is saving the path of the uploaded file into the avatar file in the user

					user.avatar = User.avatarPath + "/" + req.file.filename;
				}
				user.save();
				return res.redirect("back");
			});
		} else {
			return res.status(401).send("Unauthorised");
		}
	} catch (err) {
		console.log("error in updating ", err);
		return;
	}
};

// render the sing up page
module.exports.signUp = function (req, res) {
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}

	return res.render("user_sign_up", {
		title: "codeial  | Sign Up",
	});
};

// render the sing in page
module.exports.signIn = async function (req, res) {
	if (req.isAuthenticated()) {
		let user = await User.findById(req.user._id);
		return res.render("user_profile", {
			title: "User Profile",
			profile_user: user,
		});
	}

	return res.render("user_sign_in", {
		title: "codeial  | Sign In",
	});
};

//get the sing up data
module.exports.create = async function (req, res) {
	//    if(req.body.passowrd != req.body.confirm_passowrd){
	//     return res.redirect('back');
	//    }
	//    try{
	//     const user = await User.findOne({email:req.body.email})
	//     if(!user){
	//         await User.create(req.body);
	//     }
	//     return res.redirect('/users/sign-in')
	//    }

	//    catch(err){
	//     console.log('error cradting user while signing up');
	//     return res.redirect('back');
	//    }

	try {
		let user = await User.findOne({ email: req.body.email });

		if (!user) {
			await User.create(req.body);

			return res.redirect("/users/sign-in");
		} else {
			return res.redirect("back");
		}
	} catch (err) {
		console.log('error in create',err);
	}
};

module.exports.createSession = async function (req, res) {
	// steps to authenticate
	// find the user

	// try{
	//     const user = await User.findOne({email: req.body.email})
	//     if(user){
	//         if (user.password != req.body.password) {
	//             return res.redirect("back");
	//           }
	//           res.cookie("user_id", user.id);
	//           return res.redirect("/users/profile");
	//     }
	// }
	// catch(err){
	//     console.log("error in finding user in signing in");
	//     return;
	// }

	// User.findOne({ email: req.body.email }, function (err, user) {
	//   if (err) {
	//     console.log("error in finding user in signing in");
	//     return;
	//   }
	//   // handle user found
	//   if (user) {
	//     // handle password which doesn't match
	//     if (user.password != req.body.password) {
	//       return res.redirect("back");
	//     }

	//     // handle session creation
	//     res.cookie("user_id", user.id);
	//     return res.redirect("/users/profile");
	//   } else {
	//     // handle user not found

	//     return res.redirect("back");
	//   }
	// });
	req.flash("success", "Logged in Successfully");
	return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "Logged out Successfully");
		res.redirect("/");
	});
};

//handle user not found


