var express = require('express');
const quiz = require('../control/quiz');
const queries = require('../queries/quiz');

var router = express.Router();

router.get('/solarzip/:id', function(req, res, next) {
    queries.getSolarProdZip(req,res);
});



module.exports = router;