const options = require('../../env/db.config');
const knex = require('knex')(options);

const jobs = [
  {
    id: 1,
    disciplineId: 1,
    jobValue: 'laba1',
    maxPoint: 10,
    deleted: false,
  },
  {
    id: 2,
    disciplineId: 1,
    jobValue: 'laba2',
    maxPoint: 20,
    deleted: false,
  },
  {
    id: 3,
    disciplineId: 1,
    jobValue: 'laba3',
    maxPoint: 20,
    deleted: false,
  },
  {
    id: 4,
    disciplineId: 1,
    jobValue: 'laba4',
    maxPoint: 20,
    deleted: false,
  },
  {
    id: 5,
    disciplineId: 1,
    jobValue: 'laba5',
    maxPoint: 30,
    deleted: false,
  },
  {
    id: 6,
    disciplineId: 1,
    jobValue: 'laba6',
    maxPoint: 30,
    deleted: false,
  },
  {
    id: 7,
    disciplineId: 2,
    jobValue: '02/02',
    maxPoint: 30,
    deleted: false,
  },
  {
    id: 8,
    disciplineId: 2,
    jobValue: '12/02',
    maxPoint: 30,
    deleted: false,
  },
  {
    id: 9,
    disciplineId: 2,
    jobValue: '22/02',
    maxPoint: 40,
    deleted: false,
  },
  {
    id: 10,
    disciplineId: 3,
    jobValue: 'k/r',
    maxPoint: 40,
    deleted: false,
  },
  {
    id: 11,
    disciplineId: 3,
    jobValue: 'k/r',
    maxPoint: 40,
    deleted: false,
  },
  {
    id: 12,
    disciplineId: 3,
    jobValue: 'k/r3',
    maxPoint: 40,
    deleted: false,
  },
  {
    id: 13,
    disciplineId: 3,
    jobValue: 'ekz',
    maxPoint: 40,
    deleted: false,
  },
];

knex('jobs')
  .insert(jobs)
  .then(() => console.log('jobs inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
