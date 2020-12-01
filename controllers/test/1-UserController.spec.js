/* eslint-disable */
const chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = chai;
const server = require('../../server');
const models = require('../../models/index');

chai.use(chaiHttp);
//  TODO: Fix eslint

let authTokenUser = '';
let authTokenAdmin = '';

let username = 'jessy';
let email = 'onepiece@ax.com';
let password = '1234';

describe('User controller', () => {
  it('should CREATE new user with unique username and email and return status code 201', (done) => {
    chai
      .request(server)
      .post('/users/signup')
      .send({
        firstName: 'Simeon',
        lastName: 'Busari',
        username: 'burundi',
        email: email,
        password: password,
        content: 'Software Developer',
        caption: 'Fabulous',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it('should receive req.status 403 since the username and the email address already exist', (done) => {
    chai
      .request(server)
      .post('/users/signup')
      .send({
        firstName: 'Johny',
        lastName: 'Dep',
        username: 'burundi',
        email: email,
        password: password,
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should GET all users from the server', (done) => {
    chai
      .request(server)
      .get('/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

  it('should login successfully as a user and the res.body should have a token', (done) => {
    chai
      .request(server)
      .post('/users/signin')
      .send({
        username: username,
        password: password,
      })
      .end((err, res) => {
        authTokenUser = res.body.token;

        expect(res).to.have.status(200);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('token');
        done();
      });
  });

  it('should login successfully as an Admin and the res.body should have a token', (done) => {
    chai
      .request(server)
      .post('/users/signin')
      .send({
        username: 'moonellator',
        password: '1234',
      })
      .end((err, res) => {
        authTokenAdmin = res.body.token;

        expect(res).to.have.status(200);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('token');
        done();
      });
  });

  it('should fail to login and receive status code 403 due to wrong login credentials', (done) => {
    chai
      .request(server)
      .post('/users/signin')
      .send({
        username: username,
        password: '2',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        done();
      });
  });

  it('should return information for the current (autheticated) user', (done) => {
    chai
      .request(server)
      .get('/users/me')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an.instanceof(Object);
        expect(res.body.username).to.equal(username);
        expect(res.body.email).to.equal('jessy@example.com');
        done();
      });
  });

  it('should fail to return information for the current user since he is Unauthenticated (returns status code 401).', (done) => {
    chai
      .request(server)
      .get('/users/me')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should UPDATE user successfully because he/she is Auth and provided valid JWToken (status 200)', (done) => {
    chai
      .request(server)
      .patch('/users/me')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .send({
        firstName: 'Immanuella',
        city: 'Varna',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should FOLLOW another user that exists in the DB and return status code 201.', (done) => {
    chai
      .request(server)
      .post('/users/1/follow')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.followed_user)
          .to.be.an.instanceof(Object)
          .and.to.have.property('username');
        expect(res.body.followed_user.username).to.equal('moonellator');
        done();
      });
  });

  it('should FAIL to FOLLOW the same user twice and return status code 404.', (done) => {
    chai
      .request(server)
      .post('/users/1/follow')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should UNFOLLOW user that is already marked as followed inside the Relationships table. Expecting status code 200.', (done) => {
    chai
      .request(server)
      .post('/users/1/unfollow')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.unfollowed_user)
          .to.be.an.instanceof(Object)
          .and.to.have.property('username');
        expect(res.body.unfollowed_user.username).to.equal('moonellator');
        done();
      });
  });

  it('should NOT be able to UNFOLLOW user that is not being followed currently', (done) => {
    chai
      .request(server)
      .post('/users/1/unfollow')
      .set('Authorization', `Bearer ${authTokenUser}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should get all the users the userId in url follows and return status code 200', (done) => {
    chai
      .request(server)
      .get('/users/2/following')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should FAIL to get all the users the userId in url follows because user does not exist - status code 404', (done) => {
    chai
      .request(server)
      .get('/users/2000/following')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should GET all the users the userId in url follows and return status code 200', (done) => {
    chai
      .request(server)
      .get('/users/2/followers')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it(`should FAIL to GET user's followers because user does not exist - status code 404`, (done) => {
    chai
      .request(server)
      .get('/users/2000/followers')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it(`should take user's posts with status 200`, (done) => {
    chai
      .request(server)
      .get('/users/2/posts')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it(`should fail to take user's posts because user doesn't exist = expecting status code 404.`, (done) => {
    chai
      .request(server)
      .get('/users/56/posts')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  after(() => {
    // let's use authenticated user inside other tests as well
    module.exports = { authTokenUser, authTokenAdmin };
  });
});
