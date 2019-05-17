const options = require('../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('jobs', table => {
    table.increments('id');
    table.integer('disciplineId');
    table.string('jobValue');
  })
  .then(() => console.log('table jobs created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
