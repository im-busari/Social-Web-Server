/* eslint-disable */
const chai = require('chai');
let chaiHttp = require('chai-http');
const { expect } = chai;
const server = require('../../server');

chai.use(chaiHttp);

let localUserToken = '';
let localAdminToken = '';
let newComment;

describe('Comment controller', () => {
  before(() => {
    const {
      authTokenUser,
      authTokenAdmin,
    } = require('./1-UserController.spec.js');
    localUserToken = authTokenUser;
    localAdminToken = authTokenAdmin;
  });

  //  Create comment tests
  it('should create new comment because we have Authenticated User and Post exists. Expecting res.status = 201', (done) => {
    chai
      .request(server)
      .post('/comments/1')
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        content: 'Testing storeComment function',
      })
      .end((err, res) => {
        newComment = res.body.id;
        expect(res).to.have.status(201);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('content');
        expect(res.body.content).to.equal('Testing storeComment function');
        done();
      });
  });

  it(`should FAIL to create new comment because Post doesn't exist. Expecting res.status = 404`, (done) => {
    chai
      .request(server)
      .post('/comments/25')
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        content: 'Testing storeComment function',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it(`should FAIL to create new comment because User is not Auth. Expecting res.status = 401`, (done) => {
    chai
      .request(server)
      .post('/comments/25')
      .send({
        content: 'Testing storeComment function',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  //  GET comment
  it(`should successfully get comment by given ID because it exists. Expecting res.status = 200`, (done) => {
    chai
      .request(server)
      .get('/comments/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('object');
        done();
      });
  });

  it(`should FAIL to get comment because ID is not in the system. Expecting res.status = 404`, (done) => {
    chai
      .request(server)
      .get('/comments/40')
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  //  UPDATE comment
  it(`should successfully update comment because it belongs to the Authenticated User. Expecting res.status = 200`, (done) => {
    chai
      .request(server)
      .patch(`/comments/${newComment}`)
      .set('Authorization', `Bearer ${localUserToken}`)
      .send({
        content: 'Updated Successfully',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body)
          .to.be.an.instanceof(Object)
          .and.to.have.property('content');
        expect(res.body.content).to.equal('Updated Successfully');
        done();
      });
  });

  it(`should FAIL to update comment because it doesn't belong to the current user. Expecting res.status = 404`, (done) => {
    chai
      .request(server)
      .patch(`/comments/${newComment}`)
      .set('Authorization', `Bearer ${localAdminToken}`)
      .send({
        content: 'Updated Successfully',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });

  it(`should FAIL to update comment because User is not Authenticated. Expecting res.status = 401`, (done) => {
    chai
      .request(server)
      .patch(`/comments/${newComment}`)
      .send({
        content: 'Updated Successfully',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

  //  DELETE comment
  it('should successfully delete comment because it belongs to the User. Expecting res.status = 200', (done) => {
    chai
      .request(server)
      .delete(`/comments/${newComment}`)
      .set('Authorization', `Bearer ${localUserToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should successfully delete comment because user is Admin. Expecting res.status = 200', (done) => {
    chai
      .request(server)
      .delete(`/comments/1`)
      .set('Authorization', `Bearer ${localAdminToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  it('should FAIL to delete comment because it no longer exists. Expecting res.status = 404', (done) => {
    chai
      .request(server)
      .delete(`/comments/1`)
      .set('Authorization', `Bearer ${localUserToken}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        done();
      });
  });
  it('should FAIL to delete comment because user is not Auth. Expecting res.status = 401', (done) => {
    chai
      .request(server)
      .delete(`/comments/1`)
      .end((err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });
});
