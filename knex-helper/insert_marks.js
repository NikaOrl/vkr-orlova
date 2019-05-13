const options = require('../env/db.config');
const knex = require('knex')(options);

const marks = [
  {
    id: 1,
    studentId: 1,
    markTitleID: 1,
    markValue: '01.02'
  },
  {
    id: 1,
    studentId: 1,
    markTitleID: 1,
    markValue: '01.02'
  }
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
