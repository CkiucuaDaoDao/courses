const Course = require('../models/Course.js');

class NewsController{
    index(req, res){
        res.render('news');
    }

    show(req, res){
        res.send('NEWS DETAIL')
    }
}

module.exports = new NewsController;
