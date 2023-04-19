const Post = require('../models/post');
const User = require('../models/user')

module.exports.home =function(req, res){
    // console.log(req);
    // return res.end('<h1>Express is up for codial</h1>');
    // console.log(res.render('home'));

    // console.log(req.cookies);
    // res.cookie('user_id', 25)

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title:'Home',
    //         posts: posts
    //     });
    // });


    // populate the user of the each page
    Post.find({})
    .populate('user')
    .populate({
        path : 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err, posts){
        User.find({}, function(err, users){
            if(err){
                console.log('Error in finding users', err);
            }
            return res.render('home', {
            title:'Home',
            posts: posts,
            all_users: users
            });
        })
        
    });



    // let posts =await Post.find({})
    // .sort('-createdAt')
    // .populate('user')
    // .populate({
    //     path: 'comments',
    //     populate : {
    //         path: 'user'
    //     }
    // })
    // .exec();
    // if(posts){
        
    //         return res.render('home',{
    //             title: "Home",
    //             posts: posts,
    //         })
        
    // }
   
}