const bcrypt = require('bcryptjs');
const options = require('../../env/db.config');
const knex = require('knex')(options);

function createUser(req) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(req.body.password, salt);
  return knex('teachers').insert({
    email: req.body.email,
    password: hash,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    isAdmin: req.body.isAdmin,
  });
}

function getUser(email) {
  return knex('teachers')
    .where({ email })
    .first();
}

function comparePass(userPassword, databasePassword) {
  const bool = bcrypt.compareSync(userPassword, databasePassword);
  if (!bool) throw new Error('bad pass silly money');
  else return true;
}

module.exports = {
  createUser,
  getUser,
  comparePass,
};
