const options = require('../env/db.config');
const knex = require('knex')(options);

const studentsDisciplines = [
  {
    id: 1,
    studentId: 1,
    disciplineId: 1,
  },
  {
    id: 2,
    studentId: 2,
    disciplineId: 1,
  },
  {
    id: 3,
    studentId: 1,
    disciplineId: 2,
  },
  {
    id: 4,
    studentId: 3,
    disciplineId: 1,
  },
];

knex('students-disciplines')
  .insert(studentsDisciplines)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
