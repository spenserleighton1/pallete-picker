const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('GET api/v1/projects', () => {
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex.seed.run())
    .then(() => done())
  })

    it('should return all projects', (done) => {
      chai.request(server)
        .get('/api/v1/projects')
        .end((err, response) => {
          response.should.have.status(200)
          response.should.be.json
          response.should.be.a('object')
          response.body[0].id.should.be.a('number')
          response.body[0].project_name.should.be.a('string')
          response.body[0].should.have.property('project_name')

      done()
        })
    })
})

// describe('GET api/v1/palettes', () => {
//   it('should return all palettes', (done) => {
//     chai.request(server)
//       .get('/api/v1/palettes')
//       .end((err, response) => {
//         response.should.have.status(200)
//         response.should.be.json
//         response.should.be.a('object')
//     done()
//       })
//   })
// })