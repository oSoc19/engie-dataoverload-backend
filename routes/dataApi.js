var express = require('express');
const queries = require('../queries/queries');

var router = express.Router();

/* Test API */
router.get('/', function(req, res, next) {
    res.send("API is working properly");
});

/* GET */
router.get('/solar', function(req, res, next) {
    queries.getSolarAndNonSolarConsumption(req,res);
});

/* All averages */
router.get('/allaverages', function(req, res, next) {
    queries.getAverages(req,res);
});

/* POST */
router.post('/add', function(req, res, next) {
    queries.createTest(req,res);
});

module.exports = router;