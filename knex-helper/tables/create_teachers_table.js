const options = require('../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('teachers', table => {
    table.increments('id');
    table.string('firstName');
    table.string('lastName');
    table.string('email');
    table.string('password');
    table.boolean('isAdmin');
  })
  .then(() => console.log('table teachers created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
