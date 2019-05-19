const options = require('../../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('students-disciplines', table => {
    table.increments('id');
    table.integer('studentId');
    table.integer('disciplineId');
  })
  .then(() => console.log('table students-disciplines created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
