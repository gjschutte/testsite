process.env.DBCOMMAND = '@ds219839.mlab.com:19839/gjtest_test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const server = require('../app');
const Category = require('../models/category');

chai.use(chaiHttp);

describe('Categories', () => {
  beforeEach((done) => {
    /* Executed before each test
    ** Create one category
    */
    const newCategory = new Category({
      description: 'Business',
    });
    newCategory.save((err) => {
      if (err) { return (err); }
      done();
      return 0;
    });
  });

  afterEach((done) => {
    /* After eacht test: remove all categories */
    Category.collection.drop();
    done();
  });

  it('it should GET all the categories', (done) => {
    chai.request(server)
      .get('/tasks/categories')
      .end((err, res) => {
        if (err) { return (err); }
        res.should.have.status(200);
        should.not.exist(err);
        res.text.should.match(/Category List/);
        res.text.should.match(/Business/);
        done();
        return 0;
      });
  });

  it('it should get a SINGLE category on /tasks/category/<id>', (done) => {
    const newCategory = new Category({
      description: 'Private',
    });
    newCategory.save((err, data) => {
      if (err) { return (err); }
      chai.request(server)
        .get(`/tasks/category/${data.id}`)
        .end((errMes, res) => {
          res.should.have.status(200);
          res.text.should.match(/Category: Private/);
          done();
        });
      return 0;
    });
  });

  it('it should get form for creating a category on GET', (done) => {
    chai.request(server)
      .get('/tasks/category/create')
      .end((err, res) => {
        if (err) { return (err); }
        res.should.have.status(200);
        done();
        return 0;
      });
  });

  it('it should create a new category on POST', (done) => {
    chai.request(server)
      .post('/tasks/category/create')
      .send({ name: 'Holidays' })
      .end((err, res) => {
        if (err) { return (err); }
        res.should.have.status(200);
        res.text.should.match(/Category: Holidays/);
        done();
        return 0;
      });
  });
});
