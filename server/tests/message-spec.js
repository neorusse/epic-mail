import app from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

const payload = {
  subject: "Andela Tutorial",
  message: "It is easier to learn than MongoDB",
  email: "belrusc@gmail.com",
  status: "sent",
  parent_message_id: "1"
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
        userToken = res.body.token;
        done();
      });
  });
});

// Test POST sent mail route
describe('/POST messages', () => {
  it('should send an email', (done) => {
    chai.request(app)
      .post('/api/v1/messages')
      .set('authorization', userToken)
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('status').equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('object');
      done();
      });
  });
});

// Test GET all received mail route
describe('/GET messages', () => {
  it('should get all received emails', (done) => {
    chai.request(app)
      .get('/api/v1/messages')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('All received emails retrieved');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('array');
      done();
      });
  });
});

// Test GET all unread mail route
describe('/GET unread messages', () => {
  it('should get all received unread emails', (done) => {
    chai.request(app)
      .get('/api/v1/messages/unread')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Email retrieved successfully');
        expect(res.body).to.have.property('data').to.be.an('object');
      done();
      });
  });
});

// Test GET all sent mail route
describe('/GET sent messages', () => {
  it('should get all sent emails', (done) => {
    chai.request(app)
      .get('/api/v1/messages/sent')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('All sent emails retrieved');
        expect(res.body).to.have.property('data').to.be.an('array');
      done();
      });
  });
});

// Test GET a single mail route
describe('/GET/:id a sent message', () => {
  it('should get a single sent email', (done) => {
    chai.request(app)
      .get('/api/v1/messages/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Email retrieved successfully');
      done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .get('/api/v1/messages/u')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

// Test DELETE a mail route
describe('/DELETE/:id a message', () => {
  it('should delete an email', (done) => {
    chai.request(app)
      .delete('/api/v1/messages/1')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.be.an('object');
      done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .delete('/api/v1/messages/a')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Email not found in database');
        done();
      });
  });
});
