const { response } = require('express');
const User = require('../models/user');

module.exports.profile = function(req, res) {
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

    if(req.cookies.user_id){
        User.findById(req.cookies.user_id)
          .then(function(user) {
            if(user) {
              return res.render('user_profile', {
                title: 'User Profile',
                user: user
              });
            }
            return res.redirect('/users/sign-in');
          })
          .catch(function(err) {
            // handle error
          });
      } else {
        return res.redirect('/users/sign-in');
      }


};

// render the sing up page
module.exports.singUp = function(req, res) {
    return res.render('user_sign_up', {
        title: "codeial  | Sign Up"
    });
};

// render the sing in page
module.exports.singIn = function(req, res) {
    return res.render('user_sign_in', {
        title: "codeial  | Sign In"
    });
};

//get the sing up data
module.exports.create = async function(req, res) {
   if(req.body.passowrd != req.body.confirm_passowrd){
    return res.redirect('back');
   }
   try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        await User.create(req.body);
    }
    return res.redirect('/users/sign-in')
   }

   catch(err){
    console.log('error cradting user while signing up');
    return res.redirect('back');
   }
//    User.findOne({email:req.body.email}, function(err, user){
//     if(err){
//         console.log('error in finding user in sign up');
//         return;
//     }
//     if(!user){
//         User.create(req.body, function(err, user){
//             if(err){
//                 console.log('error cradting user while signing up');
//                 return;
//             }
//             return res.redirect('/users/sing-in')
//         })

//     }else{
//         return res.redirect('back');
//     }
//    });
}


// //sing in and create the session for the user 
// module.exports.createSession = function(req, res) { 

//     //setps to authenticate

//     //fing the user 

//     User.findone({email: req.body.email}, function(err, user){
//         if(err){
//             console.log('error in finding user in sign in');
//             return;
//         }

//         // handle user found which don't match

//         if(user){

//             //handle password which doesn't match
//             if(user.password != req.body.password){
//                 return res.redirect('back')
//             }

//             //  handle session creation
//              res.cookies('user_id', user.id)
//                 return res.redirect('/users/profile')
//              }

//         }else{
//              //handle user not found

//             return res.redirect('back')
//         }
        

//     }) 


module.exports.createSession = async function (req, res) {
    // steps to authenticate
    // find the user

    try{
        const user = await User.findOne({email: req.body.email})
        if(user){
            if (user.password != req.body.password) {
                return res.redirect("back");
              }
              res.cookie("user_id", user.id);
              return res.redirect("/users/profile");
        }
    }
    catch(err){
        console.log("error in finding user in signing in");
        return;
    }


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
  };



    


   

   


    //handle user not found
