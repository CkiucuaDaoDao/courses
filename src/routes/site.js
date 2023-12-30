const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');

router.get('/api/search', siteController.search);
router.get('/login', siteController.login);
router.get('/register', siteController.register);
router.get('/', siteController.index);

module.exports = router;