var express = require('express');
const queries = require('../queries/funfacts');

var router = express.Router();

/* All averages */
router.get('/allaverages', function(req, res, next) {
    queries.getAverages(req,res);
});

module.exports = router;