const options = require('../env/db.config');
const knex = require('knex')(options);

const marks = [
  {
    id: 1,
    studentId: 1,
    jobId: 1,
    markValue: '2',
  },
  {
    id: 2,
    studentId: 2,
    jobId: 1,
    markValue: '3',
  },
  {
    id: 3,
    studentId: 3,
    jobId: 1,
    markValue: '5',
  },
];

knex('marks')
  .insert(marks)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
