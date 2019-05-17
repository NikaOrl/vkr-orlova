const options = require('../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('disciplines', table => {
    table.increments('id');
    table.string('disciplineValue');
    table.integer('teacherId');
    table.integer('semesterId');
  })
  .then(() => console.log('table disciplines created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
