var express = require('express');
var router = express.Router();
const options = require('../env/db.config');
const knex = require('knex')(options);

/* GET students page. */
router.get('/students/group/:group', function(req, res, next) {
  knex
    .from('students')
    .select('*')
    .where('groupId', req.params.group)
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET marks table. */
router.get('/marks/discipline/:disciplineId', function(req, res, next) {
  knex
    .from('students-disciplines')
    .select('studentId')
    .where('disciplineId', req.params.disciplineId)
    .then(result => {
      const studentsIds = result.map(st => st.studentId);
      knex
        .from('students')
        .select('*')
        .whereIn('id', studentsIds)
        .then(studentsResult => {
          knex
            .from('jobs')
            .select('*')
            .where('disciplineId', req.params.disciplineId)
            .then(jobsResult => {
              return { jobsResult, studentsResult };
            })
            .then(({ jobsResult, studentsResult }) => {
              const jodsIds = jobsResult.map(job => job.id);
              knex
                .from('marks')
                .select('*')
                .whereIn('jobId', jodsIds)
                .then(marksResult => {
                  return { studentsResult, jobsResult, marksResult };
                })
                .then(({ studentsResult, jobsResult, marksResult }) => {
                  res.send({
                    students: studentsResult,
                    jobs: jobsResult,
                    marks: marksResult,
                  });
                })
                .catch(err => {
                  console.log(err);
                  throw err;
                });
            })
            .catch(err => {
              console.log(err);
              throw err;
            });
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET all groups */
router.get('/students/groups', function(req, res, next) {
  knex
    .from('groups')
    .select('*')
    .then(result => {
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

/* GET disciplines */
router.get('/marks/disciplines', function(req, res, next) {
  knex
    .from('disciplines')
    .select('*')
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
