const options = require('../../env/db.config');
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
