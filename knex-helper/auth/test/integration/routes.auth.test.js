process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../../src/server/app');
const options = require('../../../env/db.config');
const knex = require('knex')(options);

describe('routes : auth', () => {
  beforeEach(() => {
    return knex.migrate.rollback().then(() => {
      return knex.migrate.latest();
    });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });
});
