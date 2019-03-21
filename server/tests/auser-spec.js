import app from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

// Payload for user signup POST route
const signupPayload = {
  first_name: 'Russell',
  last_name: 'Nyorere',
  email: 'belrusc@gmail.com',
  password: 'internet12'
}

// Payload for user signin POST route
const signinPayload = {
  email: 'belrusc@gmail.com',
  password: 'internet12'
}

describe('Testing user signup and signin routes', () => {

  it('should return status 201 when new user email is created', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signupPayload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('token').to.be.a('string');
      done();
      });
  });

  it('should return status 200 when user signin is successful', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
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
