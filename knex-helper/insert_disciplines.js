const options = require('../env/db.config');
const knex = require('knex')(options);

const disciplines = [
  {
    id: 1,
    disciplineValue: 'oop',
    teacherId: 1,
    semesterId: 1,
  },
  {
    id: 2,
    disciplineValue: 'oop',
    teacherId: 1,
    semesterId: 1,
  },
];

knex('disciplines')
  .insert(disciplines)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
