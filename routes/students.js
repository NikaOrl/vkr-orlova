var express = require('express');
var router = express.Router();

const options = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'vkr_db',
  },
};

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
    })
    .finally(() => {
      knex.destroy();
    });
});

module.exports = router;
