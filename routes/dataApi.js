var express = require('express');
var router = express.Router();

/* Test API */
router.get('/', function(req, res, next) {
    res.send("API is working properly");
});

/* GET */
router.get('/test', function(req, res, next) {
    var t = [];
    for(var i = 0; i < 30; i++){
        t.push({i:'test'})
    }
    res.send(t);
});

module.exports = router;