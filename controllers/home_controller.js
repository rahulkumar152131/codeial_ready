module.exports.home = function(req, res){
    // console.log(req);
    // return res.end('<h1>Express is up for codial</h1>');
    // console.log(res.render('home'));

    console.log(req.cookies);
    res.cookie('user_id', 25)
    return res.render('home', {
        title:'Home',
    });
}