const queue = require('../config/kue');

const commentsMiler = require('../mailers/comments_mailer');

queue.process('emails', function(job, done){
    console.log('emails worker is processing a job', job.data);
    commentsMiler.newComment(job.data);
    done();
})