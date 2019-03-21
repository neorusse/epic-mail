import app from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

const payload = {
  group_name: "Java Devs",
  "created_by": "Dev"
}
let userToken;

// Payload for user signin POST route
const signinPayload = {
  email: 'belrusc@gmail.com',
  password: 'internet12'
}

describe('Create token for user', () => {
  it('should return status 200 when user signin is successful', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(signinPayload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        userToken = `Bearer ` + res.body.token;
        done();
      });
  });
});

// Create a user group
describe('/POST messages', () => {
  it('should send an email', (done) => {
    chai.request(app)
      .post('/api/v1/groups')
      .set('authorization', userToken)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('status').equal(201);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Group Created successfully');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });
});

// Get all groups
describe('/GET messages', () => {
  it('retrieve all created groups', (done) => {
    chai.request(app)
      .get('/api/v1/groups')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
