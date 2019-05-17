process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();

const localAuth = require('../../local');

describe('encodeToken()', () => {
  it('should return a token', done => {
    const results = localAuth.encodeToken({ id: 1 });
    should.exist(results);
    results.should.be.a('string');
    done();
  });
});

describe('decodeToken()', () => {
  it('should return a payload', done => {
    const token = localAuth.encodeToken({ id: 1 });
    should.exist(token);
    token.should.be.a('string');
    localAuth.decodeToken(token, (err, res) => {
      should.not.exist(err);
      res.sub.should.eql(1);
      done();
    });
  });
});

describe('POST /auth/register', () => {
  it('should register a new user', done => {
    chai
      .request(server)
      .post('/auth/register')
      .send({
        email: 'michael',
        password: 'herman',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        done();
      });
  });
});

describe('POST /auth/login', () => {
  it('should login a user', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        email: 'jeremy',
        password: 'johnson123',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.redirects.length.should.eql(0);
        res.status.should.eql(200);
        res.type.should.eql('application/json');
        res.body.should.include.keys('status', 'token');
        res.body.status.should.eql('success');
        should.exist(res.body.token);
        done();
      });
  });

  it('should not login an unregistered user', done => {
    chai
      .request(server)
      .post('/auth/login')
      .send({
        email: 'michael',
        password: 'johnson123',
      })
      .end((err, res) => {
        should.exist(err);
        res.status.should.eql(500);
        res.type.should.eql('application/json');
        res.body.status.should.eql('error');
        done();
      });
  });
});
