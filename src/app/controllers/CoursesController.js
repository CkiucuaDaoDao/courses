const Course = require('../models/Course.js');
const { mongooseToObject } = require('../../util/mongoose.js');

class CoursesController{

    show(req, res, next){
        Course.findOne({ slug: req.params.slug })
        .then(course => {
            res.render('courses/show', { course: mongooseToObject(course) });
        })
        .catch(next);
    }

    create(req, res){
        res.render('courses/create');
    }

    store(req, res, next){
        req.body.image = `https://i.ytimg.com/vi/${req.body.videoId}/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLBbxlpJJBXZdA4wnTHnq9RYsRJAVQ`;
        const course = new Course(req.body);
        course.save()
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);        
    }

    edit(req, res, next){
        Course.findById(req.params.id)
            .then(course => res.render('courses/edit', {
                course: mongooseToObject(course)
            }))
            .catch(next);
        
    }

    update(req, res, next){
        Course.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/me/stored/courses'))
            .catch(next);
    }

    delete(req, res, next){
        Course.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    restore(req, res, next){
        Course.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDelete(req, res, next){
        Course.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    handleFormActions(req, res, next){
        switch(req.body.action) {
            case 'delete':
                Course.delete({ _id: {$in: req.body.courseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'restore':
                Course.restore({ _id: {$in: req.body.courseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'force':
                Course.deleteMany({ _id: {$in: req.body.courseIds} })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            default:
                res.json({message: 'Action is invalid'});
        }
    }

}

module.exports = new CoursesController;
