import app from '../app';
import supertest from 'supertest'
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

let requester = supertest(app);

// Payload for user signup POST route
const signupPayload = {
  firstName: 'Russell',
  lastName: 'Nyorere',
  email: 'ruscom@gmail.com',
  password: 'internet12',
  mobileNumber: '08068908852'
}

// Payload for user signin POST route
const signinPayload = {
  email: 'ruscom@gmail.com',
  password: 'internet12'
}

describe('Testing user signup and signin routes', () => {

  it('should return status 201 when new user email is created', (done) => {
    requester
      .post('/api/v1/auth/signup')
      .send(signupPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('token').to.be.a('string');
      done();
      });
  });

  it('should return status 200 when user signin is successful', (done) => {
    requester
      .post('/api/v1/auth/signin')
      .send(signinPayload)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('token').to.be.a('string');
      done();
      });
  });
});
