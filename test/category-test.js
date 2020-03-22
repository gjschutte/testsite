process.env.DBCOMMAND = '@ds219839.mlab.com:19839/gjtest_test';

let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../app');

let Task = require("../models/task");
let Status = require("../models/status");
let Category = require("../models/category");

describe ('Categories', function() {
    
    beforeEach (function(done) {
        /* Executed before each test
        ** Create one category
        */
        var newCategory = new Category ({
            description: 'Business'
        });
        newCategory.save(function(err) {
            done();
        });
    });
    
    afterEach(function(done) {
        /* After eacht test: remove all categories */
        Category.collection.drop();
        done();
    });
    
     it('it should GET all the categories', (done) => {
     chai.request(server)
        .get('/tasks/categories')
        .end((err, res) => {
            res.should.have.status(200);
            should.not.exist(err);
            res.text.should.match(/Category List/);
            res.text.should.match(/Business/);
            done();
        });
    });

    it ('it should get a SINGLE category on /tasks/category/<id>', function (done) {
        var newCategory = new Category({
            description: 'Private'
        });
        newCategory.save(function(err, data) {
            chai.request(server)
                .get('/tasks/category/'+data.id)
                .end (function(err, res) {
                    res.should.have.status(200);
                    res.text.should.match(/Category: Private/);
                    done();
                });
        });
    });

     it('it should get form for creating a category on GET', (done) => {
     chai.request(server)
        .get('/tasks/category/create')
        .end((err, res) => {
            res.should.have.status(200);
            done();
        });
    });

     it('it should create a new category on POST', (done) => {
     chai.request(server)
        .post('/tasks/category/create')
        .send({name: 'Holidays'})
        .end((err, res) => {
            res.should.have.status(200);
            res.text.should.match(/Category: Holidays/);
            done();
        });
    });


})
