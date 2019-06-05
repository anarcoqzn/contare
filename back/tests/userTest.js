const User = require('../models/User')
const chai      = require('chai')
const expect    = chai.expect
const chaiHttp = require('chai-http')
const should = chai.should();
const requestAgent = require('supertest')
chai.use(chaiHttp)


describe('Testing registration routes', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });

    beforeEach((done) => {
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste", 'email':"teste@mail.com", 'password':"teste"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
        
    });

    it('expense with guest', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste',
            email:"teste@mail.com", 
            password:"teste"
        }
        var user_token;

        // authenticate user 1
        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                // user 1 add expense with friends
                chai.request('http://localhost:8080/contare')
                    .put('/user')
                    .send({ name: 'Teste',
                            email:"teste@mail.com", 
                            password:"teste",
                            rent: 100
                        })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, res) => {
                        should.exist(res)
                        res.should.have.status(200)
                        expect(res.body).to.include({rent: 100, name: 'Teste', email: 'teste@mail.com'})
                        done()
                    })
                })
            })

});