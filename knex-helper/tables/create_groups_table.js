const options = require('../../env/db.config');
const knex = require('knex')(options);

knex.schema
  .createTable('groups', table => {
    table.increments('id');
    table.integer('groupNumber');
  })
  .then(() => console.log('table groups created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
