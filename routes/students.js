var express = require('express');
var router = express.Router();
const options = require('../env/db.config');
const knex = require('knex')(options);

/* GET students page. */
router.get('/students/:group', function(req, res, next) {
  knex
    .from('students')
    .select('*')
    .where('groupNumber', req.params.group)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET marks table. */
router.get('/marks/:group/:discipline', function(req, res, next) {
  knex
    .from('students')
    .select('*')
    .where('groupNumber', req.params.group)
    .where(/*...*/)
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET marks started page. */
router.get('/marks-page-data', function(req, res, next) {
  /** should return groups, disciplines for the first group and marks */
  knex
    .from('students')
    .select('*')
    .where(/*...*/)
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET all groups */
// router.get('/groups', function(req, res, next) {
//   knex
//     .from('groups')
//     .select('*')
//     .then(result => {
//       res.send({ result });
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// });

/* GET groups for discipline */
// router.get('/groups/:discipline', function(req, res, next) {
//   knex
//     .from('groups')
//     .select('*')
//     .where(/*...*/)
//     .then(result => {
//       res.send({ result });
//     })
//     .catch(err => {
//       console.log(err);
//       throw err;
//     });
// });

/* GET disciplines for group */
router.post('/disciplines/:group', function(req, res, next) {
  knex
    .from('disciplines')
    .select('*')
    .where(/*...*/)
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

// router.post('/login', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   return authHelpers
//     .getUser(username)
//     .then(response => {
//       authHelpers.comparePass(password, response.password);
//       return response;
//     })
//     .then(response => {
//       return localAuth.encodeToken(response);
//     })
//     .then(token => {
//       res.status(200).json({
//         status: 'success',
//         token: token
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         status: 'error'
//       });
//     });
// });

module.exports = router;
