const options = require('../../env/db.config');
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
    studentId: 3,
    disciplineId: 1,
  },
  {
    id: 5,
    studentId: 4,
    disciplineId: 1,
  },
  {
    id: 6,
    studentId: 5,
    disciplineId: 1,
  },
  {
    id: 7,
    studentId: 6,
    disciplineId: 1,
  },
  {
    id: 8,
    studentId: 7,
    disciplineId: 1,
  },
  {
    id: 9,
    studentId: 8,
    disciplineId: 1,
  },
  {
    id: 10,
    studentId: 9,
    disciplineId: 1,
  },
  {
    id: 11,
    studentId: 10,
    disciplineId: 1,
  },
  {
    id: 12,
    studentId: 11,
    disciplineId: 1,
  },
  {
    id: 13,
    studentId: 12,
    disciplineId: 1,
  },
  {
    id: 14,
    studentId: 13,
    disciplineId: 1,
  },
  {
    id: 15,
    studentId: 14,
    disciplineId: 1,
  },
  {
    id: 16,
    studentId: 15,
    disciplineId: 1,
  },
  {
    id: 17,
    studentId: 16,
    disciplineId: 1,
  },
  {
    id: 18,
    studentId: 17,
    disciplineId: 1,
  },
  {
    id: 19,
    studentId: 18,
    disciplineId: 1,
  },
  {
    id: 20,
    studentId: 19,
    disciplineId: 1,
  },
  {
    id: 21,
    studentId: 20,
    disciplineId: 1,
  },
  {
    id: 22,
    studentId: 21,
    disciplineId: 1,
  },
  {
    id: 23,
    studentId: 22,
    disciplineId: 1,
  },
  {
    id: 24,
    studentId: 23,
    disciplineId: 1,
  },
  {
    id: 25,
    studentId: 24,
    disciplineId: 1,
  },
  {
    id: 26,
    studentId: 25,
    disciplineId: 1,
  },
  {
    id: 27,
    studentId: 26,
    disciplineId: 1,
  },
  {
    id: 28,
    studentId: 27,
    disciplineId: 1,
  },
  {
    id: 29,
    studentId: 1,
    disciplineId: 2,
  },
  {
    id: 30,
    studentId: 2,
    disciplineId: 2,
  },
  {
    id: 31,
    studentId: 3,
    disciplineId: 2,
  },
  {
    id: 32,
    studentId: 4,
    disciplineId: 2,
  },
  {
    id: 33,
    studentId: 5,
    disciplineId: 2,
  },
  {
    id: 34,
    studentId: 6,
    disciplineId: 2,
  },
  {
    id: 35,
    studentId: 7,
    disciplineId: 2,
  },
  {
    id: 36,
    studentId: 8,
    disciplineId: 2,
  },
  {
    id: 37,
    studentId: 9,
    disciplineId: 2,
  },
  {
    id: 38,
    studentId: 10,
    disciplineId: 2,
  },
  {
    id: 39,
    studentId: 11,
    disciplineId: 2,
  },
  {
    id: 40,
    studentId: 12,
    disciplineId: 2,
  },
  {
    id: 41,
    studentId: 13,
    disciplineId: 2,
  },
  {
    id: 42,
    studentId: 14,
    disciplineId: 2,
  },
  {
    id: 43,
    studentId: 15,
    disciplineId: 2,
  },
  {
    id: 44,
    studentId: 16,
    disciplineId: 2,
  },
  {
    id: 45,
    studentId: 17,
    disciplineId: 2,
  },
  {
    id: 46,
    studentId: 18,
    disciplineId: 2,
  },
  {
    id: 47,
    studentId: 19,
    disciplineId: 3,
  },
  {
    id: 48,
    studentId: 20,
    disciplineId: 3,
  },
  {
    id: 49,
    studentId: 21,
    disciplineId: 3,
  },
  {
    id: 50,
    studentId: 22,
    disciplineId: 3,
  },
  {
    id: 51,
    studentId: 23,
    disciplineId: 3,
  },
  {
    id: 52,
    studentId: 24,
    disciplineId: 3,
  },
  {
    id: 53,
    studentId: 25,
    disciplineId: 3,
  },
  {
    id: 54,
    studentId: 26,
    disciplineId: 3,
  },
  {
    id: 55,
    studentId: 27,
    disciplineId: 3,
  },
];

knex('students-disciplines')
  .insert(studentsDisciplines)
  .then(() => console.log('students-disciplines inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
