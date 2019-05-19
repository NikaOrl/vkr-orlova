const options = require('../../env/db.config');
const knex = require('knex')(options);

const teachers = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    email: 'ivan@teacher.com',
    password: '123',
    isAdmin: true,
  },
  {
    id: 2,
    firstName: 'Petr',
    lastName: 'Petrov',
    email: 'petr@teacher.com',
    password: '123',
    isAdmin: false,
  },
  {
    id: 3,
    firstName: 'Vasia',
    lastName: 'Vasiliev',
    email: 'vasia@teacher.com',
    password: '123',
    isAdmin: false,
  },
  {
    id: 4,
    firstName: 'Sergei',
    lastName: 'Sergeev',
    email: 'serg@teacher.com',
    password: '123',
    isAdmin: false,
  },
];

knex('teachers')
  .insert(teachers)
  .then(() => console.log('teachers inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
