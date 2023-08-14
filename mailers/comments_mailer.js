const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodeMailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');
    // console.log('message is sending');
    nodeMailer.transporter.sendMail({

        from: 'rk152531@gmail.com',
        to: comment.user.email,
        subject: 'New comment publish',
        html: htmlString,
    }, (err, info) => {
        if (err) { console.log('Error in sending mail', err); return; }
        // console.log('Message send', info);
        return;
    });
}
