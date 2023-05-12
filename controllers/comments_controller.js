const Comment = require('../models/comment');
const Post = require('../models/post');
const commentMailer = require('../mailers/comments_mailer');
const Like = require('../models/like')
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');


module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user');
            // console.log(comment);
            // commentMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in craeating a queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            });
            if (req.xhr){
                // Similar for comments to fetch the user's id!
            
                console.log(comment);
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        console.log(err);
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        console.log('inside destroy controller ');
        let comment = await Comment.findById(req.params.id);
        console.log(comment);
        if (comment.user.toString() == req.user.id.toString()){
            // console.log('inside the if');
            // let postId = comment.post;

            // // comment.remove();
            // await Comment.findByIdAndDelete(req.params.id);

            // await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});
            

            // // CHANGE :: destroy the associated likes for this comment
            // await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            let postId = comment.post;
            let post = await Post.findByIdAndUpdate(postId, {
              $pull: { comments: req.params.id },
            });
            await Comment.deleteOne({ _id: req.params.id });
            await Like.deleteMany({ likable: req.params.id, onModel: "Comment" });
            // send the comment id which was deleted back to the views
            console.log('************');
            if (req.xhr){
                console.log('inside destroy hxr');
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        console.log(err);
        return;
    }
    
}


// const Comment = require('../models/comment');
// const Post = require('../models/post');

// module.exports.create = async function(req, res){

//     try{
//         let post = await Post.findById(req.body.post);

//         if (post){
//             let comment = await Comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             });

//             post.comments.push(comment);
//             post.save();

//             if (req.xhr){
//                 // Similar for comments to fetch the user's id!
//                 let comment = await comment.populate('user');
    
//                 return res.status(200).json({
//                     data: {
//                         comment: comment
//                     },
//                     message: "Post created!"
//                 });
//             }


//             req.flash('success', 'Comment published!');

//             res.redirect('/');
//         }
//     }catch(err){
//         req.flash('error', err);
//         return;
//     }
    
// }


// module.exports.destroy = async function(req, res){

//     try{
//         let comment = await Comment.findById(req.params.id);

//         if (comment.user == req.user.id){

//             let postId = comment.post;

//             comment.remove();

//             let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

//             // send the comment id which was deleted back to the views
//             if (req.xhr){
//                 return res.status(200).json({
//                     data: {
//                         comment_id: post
//                     },
//                     message: "Post deleted"
//                 });
//             }


//             req.flash('success', 'Comment deleted!');

//             return res.redirect('back');
//         }else{
//             req.flash('error', 'Unauthorized');
//             return res.redirect('back');
//         }
//     }catch(err){
//         req.flash('error', err);
//         return;
//     }
    
// }