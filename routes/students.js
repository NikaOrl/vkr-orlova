var express = require('express');
var router = express.Router();
const options = require('../env/db.config');
const knex = require('knex')(options);

const localAuth = require('../knex-helper/auth/local');
const authHelpers = require('../knex-helper/auth/_helpers');

/* GET students page. */
router.get('/students/group/:group', function(req, res, next) {
  knex
    .from('students')
    .select('*')
    .where('groupId', req.params.group)
    .andWhere('deleted', false) // in case of deleted flag
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
        .andWhere('deleted', false) // in case of deleted flag
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

router.put('/students/update', (req, res, next) => {
  Promise.all(
    req.body.map(student => {
      return knex('students')
        .where('id', student.id)
        .update(student)
        .then(result => {
          console.log(`student was updated`);
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }),
  )
    .then(() => {
      res.status(200).json({
        status: 'success',
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.put('/marks/update', (req, res, next) => {
  Promise.all(
    req.body.map(mark => {
      return knex('marks')
        .where('id', mark.id)
        .update(mark)
        .then(result => {
          console.log(`mark was updated`);
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }),
  )
    .then(() => {
      res.status(200).json({
        status: 'success',
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.put('/jobs/update', (req, res, next) => {
  Promise.all(
    req.body.map(job => {
      return knex('jobs')
        .where('id', job.id)
        .update(job)
        .then(result => {
          console.log(`job was updated`);
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    }),
  )
    .then(() => {
      res.status(200).json({
        status: 'success',
      });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.post('/students/add', (req, res, next) => {
  return knex('students')
    .insert(req.body)
    .then(result => {
      console.log(`students were added`);
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.delete('/students/delete', (req, res, next) => {
  let ids = req.query.id;
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  // in case of real deleting:
  // return knex('students')
  //   .whereIn('id', ids)
  //   .del()
  //   .then(result => {
  //     console.log(`students were deleted`);
  //     res.send({ result });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     throw err;
  //   });
  return knex('students')
    .whereIn('id', ids)
    .update('deleted', true)
    .then(result => {
      console.log(`students were deleted`);
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  return authHelpers
    .getUser(email)
    .then(response => {
      authHelpers.comparePass(password, response.password);
      return response;
    })
    .then(response => {
      return localAuth.encodeToken(response);
    })
    .then(token => {
      res.status(200).json({
        status: 'success',
        token: token,
      });
    })
    .catch(err => {
      res.status(500).send('Wrong credentials');
    });
});

router.post('/register', (req, res, next) => {
  return authHelpers
    .createUser(req)
    .then(user => {
      return localAuth.encodeToken(user[0]);
    })
    .then(token => {
      res.status(200).json({
        status: 'success',
        token: token,
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 'error',
      });
    });
});

module.exports = router;
