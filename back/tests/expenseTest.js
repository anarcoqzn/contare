const User = require('../models/User')
const Expense = require('../models/Expense')
const chai      = require('chai')
const expect    = chai.expect
const chaiHttp = require('chai-http')
const server = require('../server')
const should = chai.should();
const requestAgent = require('supertest')
chai.use(chaiHttp)

describe('update an expense', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste1", 'email':"teste1@mail.com", 'password':"teste1"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste2", 'email':"teste2@mail.com", 'password':"teste2"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste3", 'email':"teste3@mail.com", 'password':"teste3"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })
    it('User updates expense that does not exist', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                
                    chai.request('http://localhost:8080/contare')
                        .put('/user/expenses')
                        .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                        .set('Content-Type', 'application/json')
                        .set('x-access-token', user_token)
                        .end((err, res)=>{
                            should.exist(res);
                            res.should.have.status(404);
                            done();
                        })
                })
            })
        
    it('User informs invalid expense title', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                
                chai.request('http://localhost:8080/contare')
                .post('/user/expenses')
                .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })                .set('Content-Type', 'application/json')
                .set('x-access-token', user_token)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200)
                    chai.request('http://localhost:8080/contare')
                        .put('/user/expenses')
                        .send({ title: '', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                        .set('Content-Type', 'application/json')
                        .set('x-access-token', user_token)
                        .end((err, res)=>{
                            should.exist(res);
                            res.should.have.status(404);
                            done();
                        })
                })
            })
        })

it('User informs invalid expense value', (done) => {
    var serverAgent = requestAgent.agent('http://localhost:8080/contare')
    var user = {
        name: 'Teste1',
        email:"teste1@mail.com", 
        password:"teste1"
    }
    var user_token;

    serverAgent
        .post('/authenticate')
        .send(user)
        .end( (err, res) => {
            if (err) return done(err)
            should.exist(res);
            user_token = res.body.token
            res.should.have.status(200)

            chai.request('http://localhost:8080/contare')
                .post('/user/expenses')
                .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                .set('Content-Type', 'application/json')
                .set('x-access-token', user_token)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    
                    chai.request('http://localhost:8080/contare')
                    .put('/user/expenses')
                    .send({ title: 'expense test', listEmail: [{ payValue: -2 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 0 })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, res)=>{
                        should.exist(res);
                        res.should.have.status(404);
                        done();
                    })
                })
        })

    })
})

describe('Expense listing checking', function(){
    it('User doesnt have any expenses', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .get('/user/expenses')
                    .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, res) => {
                        should.exist(res);
                        res.should.have.status(200);  
                        done();
                    })
            })
    })
    })

/*describe('User registration', function(){
        it('User informs invalid name', (done) => {
            var serverAgent = requestAgent.agent('http://localhost:8080/contare')
            var user = {
                name: 'Teste1',
                email:"teste1@mail.com", 
                password:"teste1"
            }
            var user_token;
    
            serverAgent
                .post('/authenticate')
                .send(user)
                .end( (err, res) => {
                    if (err) return done(err)
                    should.exist(res);
                    user_token = res.body.token
                    res.should.have.status(200)
    
                    chai.request('http://localhost:8080/contare')
                        .put('/user')
                        .send({'name':"", 'email':"teste@mail.com", 'password':"teste"})
                        .set('Content-Type', 'application/json')
                        .set('x-access-token', user_token)
                        .end((err, res) => {
                            should.exist(res);
                            res.should.have.status(400);  
                            done();
                        })
                })
        })
    })
    it('User informs invalid password', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)

                chai.request('http://localhost:8080/contare')
                    .put('/user')
                    .send({'name':"Teste1", 'email':"teste@mail.com", 'password':""})
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, res) => {
                        should.exist(res);
                        res.should.have.status(404);  
                        done();
                    })
            })
    })
*/

describe('saving an expense', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste1", 'email':"teste1@mail.com", 'password':"teste1"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste2", 'email':"teste2@mail.com", 'password':"teste2"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    beforeEach( ( done ) => {
        
        var url = '/register'
        chai.request('http://localhost:8080/contare')
            .post(url)
            .send({'name':"Teste3", 'email':"teste3@mail.com", 'password':"teste3"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

it('User creates expense twice', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
        }
        var user_token;

        serverAgent
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                
                chai.request('http://localhost:8080/contare')
                .post('/user/expenses')
                .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })                .set('Content-Type', 'application/json')
                .set('x-access-token', user_token)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200)

                    chai.request('http://localhost:8080/contare')
                        .post('/user/expenses')
                        .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                        .set('Content-Type', 'application/json')
                        .set('x-access-token', user_token)
                        .end((err, res)=>{
                            should.exist(res);
                            res.should.have.status(400);
                            done();
                        })
                })
            })
        })
    
})
