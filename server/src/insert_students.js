const options = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'vkr_db',
  },
};

const knex = require('knex')(options);

const students = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    numberInList: 1,
    email: 'ivan@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: true,
  },
  {
    id: 2,
    firstName: 'Petr',
    lastName: 'Petrov',
    numberInList: 2,
    email: 'petr@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: false,
  },
  {
    id: 3,
    firstName: 'Vasia',
    lastName: 'Vasiliev',
    numberInList: 3,
    email: 'vasia@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
    headStudent: false,
  },
  {
    id: 4,
    firstName: 'Sergei',
    lastName: 'Sergeev',
    numberInList: 4,
    email: 'serg@stud.com',
    hashPassword: '123',
    groupNumber: 5381,
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
