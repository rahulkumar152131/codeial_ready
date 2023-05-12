const Post = require('../../../models/post')
const Comment = require('../../../models/comment')


module.exports.index =async function(req, res){

    let post = await Post.find({})
			.sort('-createdAt')
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "user",
				},
			});

            
console.log(post);
    return res.status(200).json({
        message: 'List of post',
        posts: post,
    })
}

module.exports.destroy = async function(req, res){

    try{

        let post = await Post.findById(req.params.id);
        // console.log(post);
        if (post.user == req.user.id){
            console.log(post);
            await Post.findByIdAndDelete(req.params.id);
            await Comment.deleteMany({post: req.params.id});

            return res.status(200).json({
                message: 'Post and associated comment deleted successfully'
            });
        }else{
            return res.status(401).json({
                message: 'You cannot delete this post!'
            });
        }

    }catch(err){
        console.log('****', err);
        // req.flash('error', err);
        return res.status(500).json({
            message: 'internal serer error'
        });
    }
    
}