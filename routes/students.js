var express = require('express');
var router = express.Router();
const options = require('../env/db.config');
const knex = require('knex')(options);

/* GET home page. */
router.get('/', function(req, res, next) {
  knex
    .from('students')
    .select('*')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

module.exports = router;
