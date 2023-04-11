module.exports.home = function(req, res){
    // console.log(req);
    // return res.end('<h1>Express is up for codial</h1>');
    // console.log(res.render('home'));
    return res.render('home', {
        title:'Home',
    });
}