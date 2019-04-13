import app from '../app';
import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect, should } = chai;
should();

chai.use(chaiHttp);

let id;
let groupId;
let userToken;

// ========================USER TEST=====================

// POST user signup test
describe('Testing user signup routes', () => {

  it('It should allow new users to sign up', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'lucky',
        lastName: 'orogun',
        email: 'admin@epicmail.com',
        password: 'amazon12',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(201);
        res.body.should.be.an('object');
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('token').to.be.a('string');
      done();
      });
  });

  it('It should allow more new users sign up', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'Rurho',
        lastName: 'Nyorere',
        email: 'rurho@epicmail.com',
        password: 'amazon12',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(201);
        res.body.should.have.property('status');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });

  it('It should respond with an error if user exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'lucky',
        lastName: 'orogun',
        email: 'admin@epicmail.com',
        password: 'amazon12',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(409);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        expect(res.body).to.have.property('error').equal('User with that EMAIL already exist');
        done();
      });
  });

  it('It should respond with an error if user credentials are incorrect', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: '',
        lastName: '',
        email: '',
        password: 'amazon',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
});

// POST user login test
describe('Testing user login routes', () => {
  it('It should allow registered users to login', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@epicmail.com',
        password: 'amazon12'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.body.should.have.property('status');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Authentication Successful');
        expect(res.body).to.have.property('token').to.be.a('string');
        userToken = res.body.token;
        done();
      });
  });

  it('It should respond with an error if user does not exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user@epicmail.com',
        password: 'amazon12'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        expect(res.body).to.have.property('error').equal('User is not a registered member');
        done();
      });
  });

  it('It should respond with an error if user credentials are incorrect', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: '',
        password: 'amazon12',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
});

// ========================MESSAGE TEST=====================

const payload = {
  subject: "Andela Tutorial",
  message: "It is easier to learn than MongoDB",
  email: "admin@epicmail.com",
  status: "sent",
  parent_message_id: "1"
}

// Test POST sent mail route
describe('/POST messages', () => {
  it('It should allow registered user create / send email', (done) => {
    chai.request(app)
      .post('/api/v1/messages')
      .set('authorization', userToken)
      .send(payload)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(201);
        expect(res.body).to.have.property('status').equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });

  it('Should return an error if reciever does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/messages')
      .set('authorization', userToken)
      .send({
        sender: 'russ@epicmail.com',
        subject: 'Udacity NanoDegree',
        message: 'You are invited to register as an alumni',
        email: 'javadev@gmail.com',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        expect(res.body).to.have.property('status').equal(404);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body).to.have.property('error').equal('Recipient is not a registered member');
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
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('All received emails retrieved');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('array');
        id = res.body.data[0].id;
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
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Email retrieved successfully');
        expect(res.body).to.have.property('data').to.be.an('array');
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
        expect(err).to.be.null;
        res.should.have.status(200);
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
      .get(`/api/v1/messages/${id}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').to.be.a('string');
        expect(res.body).to.have.property('message').equal('Email retrieved successfully');
        done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .get('/api/v1/messages/u1s')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

// Test DELETE a mail route
describe('/DELETE/:id a message', () => {
  it('should delete an email', (done) => {
    chai.request(app)
      .delete(`/api/v1/messages/${id}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(200);
        expect(res.body).to.have.property('message').equal('Email deleted successfully');
        done();
      });
  });

  it('should return error for invalid message id', (done) => {
    chai.request(app)
      .delete('/api/v1/messages/t5s')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').equal(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

// ========================GROUPS TEST======================

// Create a user group
describe('/POST Create a group', () => {

  it('unauthorized users cannot create a group', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/groups')
      .send({
        name: 'Udacity Academy Bootcamp',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(403);
        done();
      });
  });

  it('authorized users can create a group', (done) => {
    chai.request(app)
      .post('/api/v1/groups')
      .set('authorization', userToken)
      .send({
        name: 'Udacity Academy Bootcamp',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(201);
        expect(res.body).to.have.property('status').equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data').to.be.an('object');
        groupId = res.body.data.id;
        done();
      });
  });
});

// Get all groups
describe('/GET Retrieve all groups', () => {
  it('retrieve all created groups', (done) => {
    chai.request(app)
      .get('/api/v1/groups')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('count');
        expect(res.body).to.have.property('message').equal('All created groups retrieved successfully');
        done();
      });
  });

  it('unauthorized users cannot retrieve all groups', (done) => {
    // using chai-http plugin
    chai.request(app)
      .get('/api/v1/groups')
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(403);
        done();
      });
  });
});

// Update a group
describe('/PATCH update group name', () => {

  it('check for wrong input', (done) => {
    // using chai-http plugin
    chai.request(app)
      .patch('/api/v1/groups/sdf')
      .set('authorisation', userToken)
      .send({
        name: 'Lekki Meetup',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(403);
        done();
      });
  });

  it('check if group exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .patch('/api/v1/groups/34')
      .set('authorization', userToken)
      .send({
        name: 'Lekki Meetup',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(400);
        res.should.have.property('status');
        done();
      });
  });

  it('update group name', (done) => {
    // using chai-http plugin
    chai.request(app)
      .patch(`/api/v1/groups/${groupId}`)
      .set('authorization', userToken)
      .send({
        name: 'Udacity Academy Bootcamp',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.should.have.property('status');
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });
});

// delete group
describe('/DELETE group', () => {
  it('It should delete a specific group ', (done) => {
    // using chai-http plugin
    chai.request(app)
      .delete(`/api/v1/groups/${groupId}`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(200);
        res.should.have.property('status');
        expect(res.body).to.have.property('data').to.be.an('object');
        done();
      });
  });

  it('It should return an error for wrong groupid ', (done) => {
    // using chai-http plugin
    chai.request(app)
      .delete('/api/v1/groups/25')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        res.body.should.have.property('status');
        expect(res.body).to.have.property('error').equal('Invalid Group ID Supplied/Only Admin can delete Group');
        done();
      });
  });
});

// Add User to Group Test
describe('/POST add user to Group Test', () => {

  it('check if group exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post('/api/v1/groups/17/users')
      .set('authorization', userToken)
      .send({
        email: 'russ@epicmail.com',
        role: 'member'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        expect(res.body).to.have.property('error').equal('Group does not exist');
        done();
      });
  });

  it('check for wrong user details', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post(`/api/v1/groups/${groupId}/users`)
      .set('authorization', userToken)
      .send({
        email: 'user@epicmail',
        role: 'member'
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        done();
      });
 });

  it('Check if member to be added is a registered user', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post(`/api/v1/groups/${groupId}/users`)
      .set('authorization', userToken)
      .send({
        email: 'rurho@epicmail.com',
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        done();
      });
  });

  // it('add registered user to group', (done) => {
  //   // using chai-http plugin
  //   chai.request(app)
  //     .post(`/api/v1/groups/${groupId}/users`)
  //     .set('authorization', userToken)
  //     .send({
  //       email: 'rurho@epicmail.com'
  //     })
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       res.should.have.status(201);
  //       done();
  //     });
  // });

});

// Delete User from Group Test
describe('/Delete User From Group Test', () => {

  it('check if group exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .delete(`/api/v1/groups/34/users/2`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(403);
        expect(res.body).to.have.property('error').equal('Group does not exist');
        done();
      });
  });


  it('check if user exists', (done) => {
    // using chai-http plugin
    chai.request(app)
      .delete(`/api/v1/groups/${groupId}/users/4`)
      .set('authorization', userToken)
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(403);
        done();
      });
  });

  // it('delete user from group', (done) => {
  //   // using chai-http plugin
  //   chai.request(app)
  //     .delete(`/api/v1/groups/${groupId}/users/2`)
  //     .set('authorization', userToken)
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       res.should.have.status(200);
  //       done();
  //     });
  // });

});


// Send message to group members
describe('Send message to group members', () => {

  it('check for wrong inputs', (done) => {
    // using chai-http plugin
    chai.request(app)
      .post(`/api/v1/groups/${groupId}/messages`)
      .set('authorization', userToken)
      .send({
        subject: "",
        message: "You have been accepted into the Fellowship"
      })
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(500);
        done();
      });
  });

  // it('send message to group', (done) => {
  //   // using chai-http plugin
  //   chai.request(app)
  //     .post(`/api/v1/groups/${groupId}/messages`)
  //     .set('authorization', userToken)
  //     .send({
  //       subject: "From HR Group 11",
  //       message: "You have been accepted into the Fellowship"
  //     })
  //     .end((err, res) => {
  //       expect(err).to.be.null;
  //       res.should.have.status(201);
  //       done();
  //     });
  // });

});


// Custom Error Handling Tests
describe('Check for any wrong endpoints requested', () => {
  it('custom error checking', (done) => {
    // using chai-http plugin
    chai.request(app)
      .get('/api/v1/')
      .end((err, res) => {
        expect(err).to.be.null;
        res.should.have.status(404);
        done();
      });
  });
});
