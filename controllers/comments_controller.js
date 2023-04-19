const Comment = require('../models/comment');
const Post = require('../models/post')
module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
        if(post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            }, function(err, comment){
                //handle error

                post.comments.push(comment);
                post.save();

                res.redirect('/')
            })
        }
    })
}

module.exports.destroy = function(req, res){
    console.log("inside comment destroy");
    Comment.findById(req.params.id, function(err, comment){
        if(err){
            console.log('error in finding the comment', err);
        }
        // console.log(comment.user , req.user.id);
        if(comment.user == req.user.id){ 
            // console.log('comment is going to be deleted');
            let postId = comment.post;
            comment.remove();
            // console.log('coment removed');
            Post.findByIdAndUpdate(postId, {$pull: {comments:req.params.id} }, function(err, post){
                return res.redirect('back');
            }); 
        }
    });
}