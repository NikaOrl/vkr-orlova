const options = require('../../env/db.config');
const knex = require('knex')(options);

const students = [
  {
    id: 1,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    numberInList: 1,
    email: 'ivan@stud.com',
    groupId: 1,
    headStudent: 1,
    deleted: 0,
  },
  {
    id: 2,
    firstName: 'Petr',
    lastName: 'Petrov',
    numberInList: 2,
    email: 'petr@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 3,
    firstName: 'Vasia',
    lastName: 'Vasiliev',
    numberInList: 3,
    email: 'vasia@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 4,
    firstName: 'Sergei',
    lastName: 'Sergeev',
    numberInList: 1,
    email: 'serg@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 5,
    firstName: 'Tolya',
    lastName: 'Popov',
    numberInList: 4,
    email: 'tolya@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 6,
    firstName: 'Andrei',
    lastName: 'Markoff',
    numberInList: 5,
    email: 'andrei@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 7,
    firstName: 'Sachar',
    lastName: 'Dobrow',
    numberInList: 6,
    email: 'sachar@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 8,
    firstName: 'Kostya',
    lastName: 'Levitsky',
    numberInList: 7,
    email: 'kostya@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 9,
    firstName: 'Kolya',
    lastName: 'Morein',
    numberInList: 8,
    email: 'kolya@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 10,
    firstName: 'Anton',
    lastName: 'Markov',
    numberInList: 9,
    email: 'anton@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 11,
    firstName: 'Stenya',
    lastName: 'Polakoff',
    numberInList: 10,
    email: 'stenya@stud.com',
    groupId: 1,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 12,
    firstName: 'Boris',
    lastName: 'Savin',
    numberInList: 2,
    email: 'boris@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 13,
    firstName: 'Vladislav',
    lastName: 'Novikoff',
    numberInList: 3,
    email: 'vladislav@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 14,
    firstName: 'Vitya',
    lastName: 'Lipovsky',
    numberInList: 4,
    email: 'vitya@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 15,
    firstName: 'Oleg',
    lastName: 'Minsky',
    numberInList: 5,
    email: 'oleg@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 16,
    firstName: 'Sanya',
    lastName: 'Genrich',
    numberInList: 6,
    email: 'sanya@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 17,
    firstName: 'Anatoli',
    lastName: 'Dubow',
    numberInList: 7,
    email: 'anatoli@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 18,
    firstName: 'Zhora',
    lastName: 'Garin',
    numberInList: 8,
    email: 'zhora@stud.com',
    groupId: 2,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 19,
    firstName: 'Georgii',
    lastName: 'Litvin',
    numberInList: 1,
    email: 'georgii@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 20,
    firstName: 'Pasha',
    lastName: 'Dmitriev',
    numberInList: 2,
    email: 'pasha@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 21,
    firstName: 'Vladya',
    lastName: 'Belkin',
    numberInList: 3,
    email: 'vladya@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 22,
    firstName: 'Nil',
    lastName: 'Laskin',
    numberInList: 4,
    email: 'nil@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 23,
    firstName: 'Maksim',
    lastName: 'Dobrow',
    numberInList: 5,
    email: 'maksim@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 24,
    firstName: 'Maks',
    lastName: 'Laskin',
    numberInList: 6,
    email: 'maks@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 25,
    firstName: 'Vitya',
    lastName: 'Berezin',
    numberInList: 7,
    email: 'vitya@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 26,
    firstName: 'Danya',
    lastName: 'Volkov',
    numberInList: 8,
    email: 'danya@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
  {
    id: 27,
    firstName: 'Pasha',
    lastName: 'Genrich',
    numberInList: 9,
    email: 'pasha@stud.com',
    groupId: 3,
    headStudent: 0,
    deleted: 0,
  },
];

knex('students')
  .insert(students)
  .then(() => console.log('students inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
