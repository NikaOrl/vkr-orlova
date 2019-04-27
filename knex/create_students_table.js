const options = {
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'vkr_db',
  },
};

const knex = require('knex')(options);

knex.schema
  .createTable('students', table => {
    table.increments('id');
    table.string('firstName');
    table.string('lastName');
    table.integer('numberInList');
    table.string('email');
    table.string('hashPassword');
    table.integer('groupNumber');
    table.boolean('headStudent');
  })
  .then(() => console.log('table created'))
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
