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

knex
  .from('students')
  .select('*')
  .then(rows => {
    for (row of rows) {
      console.log(`${row['id']} ${row['firstName']}`);
    }
  })
  .catch(err => {
    console.log(err);
    throw err;
  })
  .finally(() => {
    knex.destroy();
  });
