const mongoose = require("mongoose");
// const multer = require("multer");
// const path = require("path");
// const AVATAR_PATH = path.join("/uploads/users/avatar");

const tokenSchema = new mongoose.Schema(
	{
		
	    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        usersToken:{
            type: String,
        },
        isValid:{
            type:Boolean,
        }
	
		
	},
	{
		timestamps: true,
	}
);

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;