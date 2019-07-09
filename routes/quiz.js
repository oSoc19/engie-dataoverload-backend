var express = require('express');
const quiz = require('../control/quiz');

var router = express.Router();

router.get('/quiz', function(req, res, next) {
    quiz.getWaterConsEstimation(req,res);
});

module.exports = router;