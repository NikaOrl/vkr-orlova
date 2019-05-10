const options = require('../env/db.config');
const knex = require('knex')(options);

knex
  .raw('SELECT VERSION()')
  .then(version => console.log(version[0][0]))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
