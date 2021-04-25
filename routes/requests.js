var express = require('express');
var router = express.Router();
const options = require('../env/db.config');
const knex = require('knex')(options);

const localAuth = require('../knex-helper/auth/local');
const authHelpers = require('../knex-helper/auth/_helpers');

/* GET students page. */
router.get('/students/group/:group', function (req, res, next) {
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

/* GET teachers page. */
router.get('/teachers', function (req, res, next) {
  knex
    .from('teachers')
    .select(['firstName', 'lastName', 'id', 'email', 'isAdmin', 'deleted'])
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
router.get('/marks/:groupId/:disciplineId', function (req, res, next) {
  // TODO: add groupId logic here
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
            .andWhere('deleted', false) // in case of deleted flag
            .then(jobsResult => {
              return { jobsResult, studentsResult };
            })
            .then(({ jobsResult, studentsResult }) => {
              const jodsIds = jobsResult.map(job => job.id);
              const studentsIds = studentsResult.map(st => st.id);
              knex
                .from('marks')
                .select('*')
                .whereIn('jobId', jodsIds)
                .whereIn('studentId', studentsIds)
                .andWhere('deleted', false) // in case of deleted flag
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
router.get('/groups', function (req, res, next) {
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
router.get('/disciplines', function (req, res, next) {
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
    })
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

router.put('/teachers/update', (req, res, next) => {
  Promise.all(
    req.body.map(teacher => {
      return knex('teachers')
        .where('id', teacher.id)
        .update(teacher)
        .then(result => {
          console.log(`teacher was updated`);
        })
        .catch(err => {
          console.log(err);
          throw err;
        });
    })
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
      if (mark.id === null) {
        return knex('marks')
          .insert(mark)
          .then(result => {
            console.log(`marks were added`);
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      } else {
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
      }
    })
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
    })
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

router.post('/marks/add', (req, res, next) => {
  return knex('marks')
    .insert(req.body)
    .then(result => {
      console.log(`marks were added`);
      res.send({ result });
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
});

router.post('/jobs/add', (req, res, next) => {
  return knex('jobs')
    .insert(req.body)
    .then(result => {
      console.log(`jobs were added`, result);
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
  return (
    knex('students')
      .whereIn('id', ids)
      // .del() // in case of real deleting
      .update('deleted', true) // in case of deleted flag
      .then(result => {
        console.log(`students were deleted`);
        res.send({ result });
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
});

router.delete('/teachers/delete', (req, res, next) => {
  let ids = req.query.id;
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return (
    knex('teachers')
      .whereIn('id', ids)
      // .del() // in case of real deleting
      .update('deleted', true) // in case of deleted flag
      .then(result => {
        console.log(`teachers were deleted`);
        res.send({ result });
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
});

router.delete('/marks/delete', (req, res, next) => {
  let jobIds = req.query.id;
  if (!Array.isArray(jobIds)) {
    jobIds = [jobIds];
  }
  return (
    knex('marks')
      .whereIn('jobId', jobIds)
      // .del() // in case of real deleting
      .update('deleted', true) // in case of deleted flag
      .then(result => {
        console.log(`marks were deleted`);
        res.send({ result });
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
});

router.delete('/jobs/delete', (req, res, next) => {
  let ids = req.query.id;
  if (!Array.isArray(ids)) {
    ids = [ids];
  }
  return (
    knex('jobs')
      .whereIn('id', ids)
      // .del() // in case of real deleting
      .update('deleted', true) // in case of deleted flag
      .then(result => {
        console.log(`jobs were deleted`);
        res.send({ result });
      })
      .catch(err => {
        console.log(err);
        throw err;
      })
  );
});

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  return authHelpers
    .getUser(email)
    .then(response => {
      authHelpers.comparePass(password, response.password);
      return { response, isAdmin: response.isAdmin };
    })
    .then(({ response, isAdmin }) => {
      return { token: localAuth.encodeToken(response), isAdmin };
    })
    .then(({ token, isAdmin }) => {
      res.status(200).json({
        status: 'success',
        token: token,
        isAdmin: isAdmin,
      });
    })
    .catch(err => {
      res.status(500).send('Wrong credentials');
    });
});

router.post('/register', (req, res, next) => {
  req.password = 'admin123';
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
