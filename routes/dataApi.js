var express = require('express');
const db = require('../queries/queries');

var router = express.Router();

/* Test API */
router.get('/', function(req, res, next) {
    res.send("API is working properly");
});

/* GET */
router.get('/test', function(req, res, next) {
    db.getAll(req,res);
});

/* POST */
router.post('/add', function(req, res, next) {
    db.createTest(req,res);
});

module.exports = router;