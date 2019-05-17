const options = require('../env/db.config');
const knex = require('knex')(options);

const students = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    numberInList: 1,
    email: 'ivan@stud.com',
    groupId: 1,
    headStudent: true,
  },
  {
    id: 2,
    firstName: 'Petr',
    lastName: 'Petrov',
    numberInList: 2,
    email: 'petr@stud.com',
    groupId: 1,
    headStudent: false,
  },
  {
    id: 3,
    firstName: 'Vasia',
    lastName: 'Vasiliev',
    numberInList: 3,
    email: 'vasia@stud.com',
    groupId: 1,
    headStudent: false,
  },
  {
    id: 4,
    firstName: 'Sergei',
    lastName: 'Sergeev',
    numberInList: 4,
    email: 'serg@stud.com',
    groupId: 2,
    headStudent: false,
  },
];

knex('students')
  .insert(students)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
