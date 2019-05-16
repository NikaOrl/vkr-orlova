const options = require('../env/db.config');
const knex = require('knex')(options);

const groups = [
  {
    id: 1,
    groupNumber: 5381,
  },
  {
    id: 2,
    groupNumber: 5382,
  },
];

knex('groups')
  .insert(groups)
  .then(() => console.log('data inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
