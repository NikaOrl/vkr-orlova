const options = require('../env/db.config');
const knex = require('knex')(options);

const jobs = [
  {
    id: 1,
    disciplineId: 1,
    jobValue: '01.01',
    deleted: false,
  },
  {
    id: 2,
    disciplineId: 1,
    jobValue: '01',
    deleted: false,
  },
  {
    id: 3,
    disciplineId: 2,
    jobValue: '02/02',
    deleted: false,
  },
];

knex('jobs')
  .insert(jobs)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
