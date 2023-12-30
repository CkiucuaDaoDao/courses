const Course = require('../models/Course.js')
const { multipleMongooseToObject } = require('../../util/mongoose.js');

class SiteController{

    login(req, res, next){
        res.render('login')
    }

    register(req, res, next){
        res.render('register')
    }

    index(req, res, next){
        Course.find({})
        .then(courses => {
            res.render('home', {
                courses: multipleMongooseToObject(courses)
            })
        })
        .catch(next);
    }

    search(req, res, next) {
        let query = req.query.term;

        Course.find({ name: { $regex: query, $options: 'i' } }).limit(5)
            .then(
                courses => {
                res.json(courses.map(item => item.name))
            })
            .catch(next);
    }
}

module.exports = new SiteController;
