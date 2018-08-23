const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

function beforeEachTest() {
    beforeEach(function(done) {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done())
  })
}

describe('Client facing routes', () => {
  beforeEachTest()
  it('should display html at root', done => {
    chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
  });

  it('should return 404 on sad path', done => {
    chai.request(server)
      .get('/404')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
  });
})

describe('GET api/v1/projects', () => {
  beforeEachTest()
  it('should return all projects', (done) => {
    chai.request(server)
      .get('/api/v1/projects')
      .end((err, response) => {
        response.should.have.status(200);        
        response.should.be.json;
        response.should.be.a('object');
        response.body[0].id.should.be.a('number');
        response.body[0].project_name.should.be.a('string');
        response.body[0].should.have.property('project_name');
    done()
      })
  })
})

describe('GET spi/v1/projects/:id', () => {
  beforeEachTest()
  it('should return a single project', done => {
    chai.request(server)
      .get('/api/v1/projects/1')
      .end(function(err, response) {
        response.should.have.status(200);        
        response.should.be.json;
        response.should.be.a('object');
        response.body[0].id.should.be.a('number');
        response.body[0].project_name.should.be.a('string');
        response.body[0].should.have.property('project_name');
    done()
      })
  })
})

describe('GET api/v1/palettes', () => {
 beforeEachTest()
  it('should return all palettes', (done) => {
    chai.request(server)
      .get('/api/v1/palettes')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body[0].id.should.be.a('number');
        response.body[0].palette_name.should.be.a('string');
        response.body[0].project_id.should.be.a('number');
        response.body[0].color_1.should.be.a('string');
        response.body[0].color_2.should.be.a('string');
        response.body[0].color_3.should.be.a('string');
        response.body[0].color_4.should.be.a('string');
        response.body[0].color_5.should.be.a('string');
    done()
      });
  });
})

describe('GET api/v1/palettes/id', () => {
  beforeEachTest()
  it('should return a single palette', done => {
    chai.request(server)
      .get('/api/v1/palettes/1')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.should.be.a('object');
        response.body[0].id.should.be.a('number');
        response.body[0].palette_name.should.be.a('string');
        response.body[0].project_id.should.be.a('number');
        response.body[0].color_1.should.be.a('string');
        response.body[0].color_2.should.be.a('string');
        response.body[0].color_3.should.be.a('string');
        response.body[0].color_4.should.be.a('string');
        response.body[0].color_5.should.be.a('string');
      done()
      })
  })
})

describe('POST api/v1/projects', () => {
  beforeEachTest()
  it('should add Project', function(done) {
    chai.request(server)
      .post('/api/v1/projects')
      .send({'project_name': 'Weatherly'})
      .end(function(err, res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.id.should.be.a('number');
        res.body.should.be.a('object');
      done();
      });
  });

  it('should error if title is missing', done => {
    chai.request(server)
      .post('/api/v1/projects')
      .send({projects:{}})
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { project_name: <STRING> }. You're missing a "project_name" property.`);
        done();
      });
  });
})

describe('POST api/v1/palettes', () => {
  beforeEachTest()
  it('should add a palette', function(done) {
    chai.request(server)
      .post('/api/v1/palettes')
      .send({ palette_name: 'Headcount2.0', 
              color_1: '#f15', 
              color_2: '#f52', 
              color_3: '#f33', 
              color_4: '#f22', 
              color_5: '#f32', 
              project_id: 1 })
      .end(function(err, res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.id.should.be.a('number');
        res.body.should.be.a('object');
        done();
      });
  });

  it('should error if title is missing', done => {
    chai.request(server)
      .post('/api/v1/palettes')
      .send({palettes:{}})
      .end((error, response) => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { palette_name: <STRING>, 'color_1' <STRING>, 'color_2' <STRING>, 'color_3' <STRING>, 'color_4' <STRING>, 'color_5' <STRING>, 'project_id <STRING>' }. You're missing a "palette_name" property.`);
        done();
      });
  });
})


describe('DELETE /api/v1/palettes/:id', () => {
  beforeEachTest()
    it('should remove a palette from the database', done => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(202);
          response.body.should.have.property('id');
          response.body.id.should.equal('1');
          response.type.should.equal('application/json');
          done();
        });
    });
});

describe('DELETE /api/v1/palettes/:project_id', () => {
  beforeEachTest()
    it('should remove all palettes matching foreign id from the database', done => {
      chai.request(server)
        .delete('/api/v1/palettes/1')
        .end((error, response) => {
          response.should.have.status(202);
          response.body.should.have.property('id');
          response.body.id.should.equal('1');
          response.type.should.equal('application/json');
          done();
        });
    });
});

















