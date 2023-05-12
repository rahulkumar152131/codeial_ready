const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');
module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user');

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{

        let post = await Post.findById(req.params.id);
        // console.log(post);
        if (post.user == req.user.id){

            // CHANGE :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});



            // post.remove();
            await Post.findByIdAndDelete(req.params.id);
            await Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'You cannot delete this post!');
            
            return res.redirect('back');
        }

    }catch(err){
        console.log(err);
        req.flash('error', err);
        return res.redirect('back');
    }
    
}


// const Post = require("../models/post");
// const Comment = require("../models/comment");

// module.exports.create = async function (req, res) {
// 	// Post.create({
// 	//     content: req.body.content,
// 	//     user: req.user._id
// 	// }, function(err, post){
// 	//     if(err){console.log('error in creating a post '); return;}
// 	//     return res.redirect('back')
// 	// })

// 	try{
//         let post = await Post.create({
//             content: req.body.content,
//             user: req.user._id
//         });
        
//         if (req.xhr){
//             // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
//             let posts = await post.populate('user');

//             return res.status(200).json({
//                 data: {
//                     post: posts
//                 },
//                 message: "Post created!"
//             });
//         }

//         req.flash('success', 'Post published!');
//         return res.redirect('back');

//     }catch(err){
//         req.flash('error', err);
//         // added this to view the error on console as well
//         console.log(err);
//         return res.redirect('back');
//     }
// };

// module.exports.destroy = async function (req, res) {
// 	// Post.findById(req.params.id, function(err, post){
// 	//     if(err){
// 	//         console.log('error in finding post',err);
// 	//     }

// 	//     //.id means converting the objedt id into string
// 	//     console.log('this is post', post);
// 	//     if(post.user == req.user.id){
// 	//         post.remove();

// 	//         Comment.deleteMany({post: req.params.id}, function(err){
// 	//             return res.redirect('back');
// 	//         });
// 	//     }else{
// 	//         return res.redirect('back');
// 	//     }
// 	// });

// 	try {
// 		let post = await Post.findById(req.params.id);

// 		if (post.user == req.user.id) {
// 			post.remove();

// 			await Comment.deleteMany({ post: req.params.id });

// 			if(req.xhr){
// 				console.log('object');
// 				return res.status(200).json({
// 					data: {
// 						post_id: req.params.id
// 					},
// 					message: 'Post deleted'
// 				})
// 			}


// 			req.flash("success", "Post and associated comment deleted");
// 			return res.redirect("back");
// 		} else {
// 			req.flash("success", "You can not delte this post!");
// 			return res.redirect("back");
// 		}
// 	} catch (err) {
// 		req.flash("error", err);
// 		return res.redirect("back");
// 	}
// };
