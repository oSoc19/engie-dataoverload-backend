var express = require('express');
const quiz = require('../control/quiz');

var router = express.Router();

router.get('/quiz', function(req, res, next) {
    quiz.getWaterConsEstimation(req,res);
});

router.get('/solarzip/:id', function(req, res, next) {
    let zip = req.params.id;
    res.send("zip: "+zip);
});

module.exports = router;