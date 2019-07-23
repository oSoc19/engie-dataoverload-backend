var express = require('express');
const queries = require('../queries/funfacts');

var router = express.Router();

/* Test API */
router.get('/', function(req, res, next) {
    res.send("API is working properly");
});

/* POST */
router.post('/add', function(req, res, next) {
    queries.createTest(req,res);
});

module.exports = router;