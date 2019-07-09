var express = require('express');
const queries = require('../queries/solar');

var router = express.Router();

/* GET */
router.get('/solar', function(req, res, next) {
    queries.getSolarAndNonSolarConsumption(req,res);
});

router.get('/solar/daily', function(req, res, next) {
    queries.getSolarDaily(req,res);
});

router.get('/solar/weekly', function(req, res, next) {
    queries.getSolarWeekly(req,res);
});

router.get('/solar/monthly', function(req, res, next) {
    queries.getSolarMonthly(req,res);
});

module.exports = router;