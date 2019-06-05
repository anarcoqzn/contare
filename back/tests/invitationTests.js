const User = require('../models/User')
const chai      = require('chai')
const expect    = chai.expect
const chaiHttp = require('chai-http')
const should = chai.should();
const requestAgent = require('supertest')
chai.use(chaiHttp)

chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these two




describe('Testing registration routes', function(){

    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();           
        });        
    });


    it('save user without error', function(done) {
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

});

describe('creating invites', function() {

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
            .send({'name':"Teste2", 'email':"teste3@mail.com", 'password':"teste3"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) => {
                should.exist(res);
                res.should.have.status(200)
                done()
            })
    })

    it('expense with guest', (done) => {
        var serverAgent = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste1',
            email:"teste1@mail.com", 
            password:"teste1"
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
                    .post('/user/expenses')
                    .send({ title: 'expense test', listEmail: [{ payValue: 50 }, { email: "teste2@mail.com", payValue: 501 }, { email: "teste3@mail.com", payValue: 301 }], totalValue: 551 })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, resnumber2) => {
                        should.exist(resnumber2);
                        // verify if the expense is in user 1 expenses list
                        chai.request('http://localhost:8080/contare')
                            .get('/user/expenses')
                            .set('Content-Type', 'application/json')
                            .set('x-access-token', user_token)
                            .end((err, resnumber3) => {
                                should.exist(resnumber3);
                                resnumber3.should.have.status(200);
                                resnumber3.body.should.be.a('array');
                                expect(resnumber3.body[0].title).to.equal('expense test')
                                expect(resnumber3.body[0].participants).to.be.an('array')
                                                                    .that.contains.something.like(
                                                                        {name: 'Teste2', participantStatus: 'WAITING', payValue: 501, email: 'teste2@mail.com'})
                                expect(resnumber3.body[0].participants).to.be.an('array')
                                                                        .that.contains.something.like(
                                                                            {name: 'Teste1', participantStatus: 'ACTIVE', payValue: 50, email: 'teste1@mail.com'})
                                expect(resnumber3.body[0].participants).to.be.an('array')
                                                                            .that.contains.something.like(
                                                                                {name: 'Teste2', participantStatus: 'WAITING', payValue: 301, email: 'teste3@mail.com'})
                                done()
                            })
                    })
            })
    })

})

describe('answer invitation', () => {
    it('declining invite', (done) => {
        var serverAgentInvitation = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste2',
            email:"teste3@mail.com", 
            password:"teste3"
        }
        var user_token;

        // authenticate user 2
        serverAgentInvitation
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                // verify if there is an invitation in list
                chai.request('http://localhost:8080/contare')
                    .get('/user/invitations')
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, getExpenses) => {
                        getExpenses.should.have.status(200);
                        expect(getExpenses.body[0].participationValue).to.equal(301)
                        // decline invitation
                        chai.request('http://localhost:8080/contare')
                            .post('/user/invitations')
                            .send({invitationId: getExpenses.body[0]._id, expense: getExpenses.body[0].expense})
                            .set('Content-Type', 'application/json')
                            .set('x-access-token', user_token)
                            .end((err, answer) => {
                                answer.should.have.status(200);
                                expect(answer.text).to.deep.equal("Convite recusado com sucesso!")
                                // verify if accepted invite doesn't becomes an expense
                                chai.request('http://localhost:8080/contare')
                                    .get('/user/expenses')
                                    .set('Content-Type', 'application/json')
                                    .set('x-access-token', user_token)
                                    .end((err, getExpensesDeclined) => {
                                        getExpensesDeclined.should.have.status(200);
                                        expect(getExpensesDeclined.body).to.be.empty
                                        done()
                                    })
                            })
                        
                    })
            })
    })

    it('accepting invite', (done) => {
        var serverAgentInvitation = requestAgent.agent('http://localhost:8080/contare')
        var user = {
            name: 'Teste2',
            email:"teste2@mail.com", 
            password:"teste2"
        }
        var user_token;

        // authenticate user 2
        serverAgentInvitation
            .post('/authenticate')
            .send(user)
            .end( (err, res) => {
                if (err) return done(err)
                should.exist(res);
                user_token = res.body.token
                res.should.have.status(200)
                // verify if there is an invitation in list
                chai.request('http://localhost:8080/contare')
                    .get('/user/invitations')
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, getExpenses) => {
                        getExpenses.should.have.status(200);
                        expect(getExpenses.body[0].participationValue).to.equal(501)
                        // accept invitation
                        chai.request('http://localhost:8080/contare')
                            .put('/user/invitations')
                            .send({invitationId: getExpenses.body[0]._id, expense: getExpenses.body[0].expense})
                            .set('Content-Type', 'application/json')
                            .set('x-access-token', user_token)
                            .end((err, answer) => {
                                answer.should.have.status(200);
                                // verify if accepted invite becomes an expense
                                chai.request('http://localhost:8080/contare')
                                    .get('/user/expenses')
                                    .set('Content-Type', 'application/json')
                                    .set('x-access-token', user_token)
                                    .end((err, getExpensesAccepted) => {
                                        getExpensesAccepted.should.have.status(200);
                                        expect(getExpensesAccepted.body[0].participants).to.be.an('array').that.contains.something.like({name: 'Teste2', email:  'teste2@mail.com', participantStatus: 'ACTIVE'})
                                        expect(getExpensesAccepted.body[0].participants).to.be.an('array').that.contains.something.like({name: 'Teste2', email:  'teste3@mail.com', participantStatus: 'REFUSED'})
                                        done()
                                    })
                            })
                        
                    })
            })
    })


})

describe('creating invite', function() {

    it('creating invite using invalid guesting', (done) => {
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
                    .send({ title: 'ExpenseTest', listEmail: [{ payValue: 150 }, { email: "testInexistent@mail.com", payValue: 510 }], totalValue: 660 })
                    .set('Content-Type', 'application/json')
                    .set('x-access-token', user_token)
                    .end((err, resnumber2) => {
                        should.exist(resnumber2);
                        resnumber2.body.should.be.a('object');
                        expect(resnumber2.body).to.be.empty
                        done()
                    })
            })
    })
})