const options = require('../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('marks', table => {
    table.increments('id');
    table.string('studentId');
    table.string('markTitleID');
    table.integer('markValue');
  })
  .then(() => console.log('table marks created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
