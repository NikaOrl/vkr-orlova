const options = require('../../env/db.config');
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
  {
    id: 3,
    groupNumber: 5302,
  },
];

knex('groups')
  .insert(groups)
  .then(() => console.log('groups inserted'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
