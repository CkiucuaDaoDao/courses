const Course = require('../models/Course.js');
const { multipleMongooseToObject } = require('../../util/mongoose.js');

class MeController{

    storedCourses(req, res, next){
        let courseQuery = Course.find({});

        if(req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type
            });
        }

        Promise.all([courseQuery, Course.countDocumentsDeleted()])
            .then(([courses, deleteCount]) =>
                res.render('me/stored-courses', { 
                    deleteCount,
                    courses: multipleMongooseToObject(courses)
                }))
            .catch(next);
    }

    trashCourses(req, res, next){
        let courseQuery = Course.findDeleted({})

        if(req.query.hasOwnProperty('_sort')) {
            courseQuery = courseQuery.sort({
                [req.query.column]: req.query.type
            });
        }
        courseQuery
            .then(courses => res.render('me/trash-courses', { courses: multipleMongooseToObject(courses)}))
            .catch(next);
    }

}

module.exports = new MeController;
