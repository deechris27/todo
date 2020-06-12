const app = require('../app');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('App', ()=>{

    it('default route should get all todos', (done)=>{
        chai.request(app)
           .get('/')
           .end((err, res)=>{
               res.should.have.status(200);
               res.body.should.be.a('array');
               res.body.length.should.be.above(0);
               done();
           })
    })

    it('login route should get access and refresh tokens', (done)=>{

        const pointy_boss = {
            username: 'Pointyhairboss'
        };
        chai.request(app)
           .post('/api/login')
           .send(pointy_boss)
           .end((err, res)=>{
               res.should.have.status(200)
               res.body.should.be.a('object')
               res.body.should.have.property('accessToken')
               res.body.should.have.property('refreshToken')
               done();
           })
    })

    it('posts route should add a new todo', (done)=>{

        const auth = {
            Authorization: 'bearer 123456789'
        };
        chai.request(app)
           .post('/api/posts')
           .send(auth)
           .end((err, res)=>{
               res.should.have.status(403) // add a valid token in auth and change this to 200 and uncomment below
            //    res.body.should.be.a('object')
            //    res.body.should.have.property('msg')
               done();
           })
    })

    it('put route to update the respective todo', (done)=>{

        const auth = {
            Authorization: 'bearer 123456789'
        };
        chai.request(app)
           .put('/api/posts/:1')
           .send(auth)
           .end((err, res)=>{
               res.should.have.status(403) // add a valid token in auth and change this to 200
               done();
           })
    })

    it('put route to delete the respective todo', (done)=>{

        const auth = {
            Authorization: 'bearer 123456789'
        };
        chai.request(app)
           .post('/api/posts/:2')
           .send(auth)
           .end((err, res)=>{
               res.should.have.status(403) // add a valid token in auth and change this to 200
               done();
           })
    })

    it('delete route to logout from the app', (done)=>{

        const auth = {
            Authorization: 'bearer 123456789'
        };
        chai.request(app)
           .delete('/api/posts/:3')
           .send(auth)
           .end((err, res)=>{
               res.should.have.status(403) // add a valid token in auth and change this to 200 and uncomment below
            //    res.body.should.not.have.property('refreshToken')
               done();
           })
    })
})