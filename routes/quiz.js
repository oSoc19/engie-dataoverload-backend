var express = require('express');
const quiz = require('../control/quiz');
const queries = require('../queries/quiz');

var router = express.Router();

router.get('/quiz', function(req, res, next) {
    quiz.getWaterConsEstimation(req,res);
});

router.get('/solarzip/:id', function(req, res, next) {
    queries.getSolarProdZip(req,res);
});



module.exports = router;