/* eslint-disable */
const chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = chai;
const server = require('../../server');

chai.use(chaiHttp);

let localUserToken = '';
let localAdminToken = '';

describe('Post controller', () => {
  before(() => {
    const {
      authTokenUser,
      authTokenAdmin,
    } = require('./1-UserController.spec.js');
    localUserToken = authTokenUser;
    localAdminToken = authTokenAdmin;
  });

  it('should GET all posts from the DB', (done) => {
    chai
      .request(server)
      .get('/posts')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

  it('should GET post by ID provided in the url address', (done) => {
    chai
      .request(server)
      .get('/posts/2')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it(`should FAIL to GET post by ID since it doesn't exists`, (done) => {
    chai
      .request(server)
      .get('/posts/26')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should GET an array of comments for the specified Post. Expecting res.status = 200', (done) => {
    chai
      .request(server)
      .get('/posts/1/comments')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        done();
      });
  });

  it(`should FAIL to GET comments for the specified Post since it doesn't exist. Expecting res.status = 200`, (done) => {
    chai
      .request(server)
      .get('/posts/500/comments')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should create new post since the user is Auth, expecting res.status 201', (done) => {
    chai
      .request(server)
      .post('/posts')
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        title: 'Unique Post',
        content: "And guess what... It's working ",
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('title');
        expect(res.body.title).to.equal('Unique Post');
        done();
      });
  });

  it('should FAIL to create new post since the user is not Auth', (done) => {
    chai
      .request(server)
      .post('/posts')
      .send({
        title: 'Unique Post',
        content: 'But you are not authenticated.',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  // Tests for UPDATE post
  it('should UPDATE post since it belongs to the user. Expected res.status = 200', (done) => {
    chai
      .request(server)
      .patch('/posts/3')
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        title: 'My Updated Post',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('title');
        expect(res.body.title).to.equal('My Updated Post');
        done();
      });
  });

  it('should FAIL to UPDATE post even though user is Admin. Expected res.status = 404', (done) => {
    chai
      .request(server)
      .patch('/posts/3')
      .set('Authorization', `Bearer ${localAdminToken}`)
      .send({
        title: 'I have the authority to do whatever I want',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it('should FAIL to update post since user is not Auth. Expecting res.status = 401', (done) => {
    chai
      .request(server)
      .patch('/posts/3')
      .send({
        title: 'My Updated Post',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should FAIL to update post since it does not belong to current user. Expecting res.status = 404', (done) => {
    chai
      .request(server)
      .patch('/posts/1')
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        title: 'My Updated Post',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  // Tests for DELETE post
  it('should DELETE post and associated comments since it belongs to the user. Expected res.status = 200', (done) => {
    chai
      .request(server)
      .delete('/posts/3')
      .set('Authorization', `Bearer ${localUserToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should DELETE post and associated comments since user is Admin. Expected res.status = 200', (done) => {
    chai
      .request(server)
      .delete('/posts/2')
      .set('Authorization', `Bearer ${localAdminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('should FAIL to delete post since user is not Auth. Expecting res.status = 401', (done) => {
    chai
      .request(server)
      .delete('/posts/3')
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  it('should FAIL to delete post since it does not belong to current user. Expecting res.status = 404', (done) => {
    chai
      .request(server)
      .delete('/posts/1')
      .set('Authorization', `Bearer ${localUserToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
});
