var express = require('express');
const queries = require('../queries/quiz');

var router = express.Router();

/* GET solar production from zip */
router.get('/solarzip/:id', function(req, res, next) {
    queries.getSolarProdZip(req,res);
});



module.exports = router;