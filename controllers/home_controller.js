const Post = require('../models/post');

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
        return res.render('home', {
            title:'Home',
            posts: posts
        });
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