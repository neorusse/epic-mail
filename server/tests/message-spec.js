import app from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

// Payload for POST mail route
const payload = {
  subject: 'Andela Fellowship',
  message: 'Congratulation, you made it into the fellowship program'
}

// Test POST sent mail route
describe('/POST messages', () => {
  it('should send an email', (done) => {
    chai.request(app)
      .post('/api/v1/messages')
      .send(payload)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.a('string');
        expect(res.body).to.have.property('message').to.be.a('string');
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.a('string');
        expect(res.body).to.have.property('message').to.be.a('string');
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.a('string');
        expect(res.body).to.have.property('message').to.be.a('string');
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
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.a('string');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('data').to.be.an('object');
      done();
      });
  });
});

// Test GET a single mail route
describe('/GET/:id a sent message', () => {
  it('should get a single sent email', (done) => {
    chai.request(app)
      .get('/api/v1/messages/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.a('string');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('data').to.be.an('object');
      done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .get('/api/v1/messages/a')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Message not found in database');
        done();
      });
  });
});

// Test DELETE a mail route
describe('/DELETE/:id a message', () => {
  it('should delete an email', (done) => {
    chai.request(app)
      .delete('/api/v1/messages/1')
      .end((err, res) => {
        expect(res).to.have.status(204);
        expect(res.body).to.be.an('object');
      done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .delete('/api/v1/messages/a')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Message not found in database');
        done();
      });
  });
});
