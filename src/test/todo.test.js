const expect = require('expect');
const request = require('supertest');
const app = require('../app');
const ToDo = require('../modules/todo');
const  {ObjectID}  = require('mongodb');
const { todo, populateTodos, user } = require('./dbtest/dbtest')


beforeEach(populateTodos);

describe('POST /todo', () => {
    it('should create new todo', (done) => {
        var text = "test todo text";
        request(app)
            .post('/todos')
            .set('x-auth', user[0].tokens[0].token)
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                 ToDo.find({text})
                    .then((todo) => {
                        expect(todo.length).toBe(1);
                        expect(todo[0].text).toBe(text);
                        done();
                    })
                    .catch((err) => done(err));
            })
        
    })

    it('should not create todo', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', user[0].tokens[0].token)
            .send({ })
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err)
                }
                ToDo.find()
                    .then((todo) => {
                        expect(todo.length).toBe(2);
                        done();
                    })
                    .catch((err)=>done(err))
            })
        
    })
})

describe('GET/ todo', () => {
    it('should get all todo', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', user[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.data.length).toBe(1);
            })
            .end(done);
    })
})

describe('GET /todo/:id', () => {
    it('should get one todo', (done) => {
        
        request(app)
            .get(`/todos/${todo[0]._id.toHexString()}`)
            .set('x-auth', user[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
               
                expect(res.body.data.text).toBe(todo[0].text)
            })
            .end(done);
        
    })
    it('should not get one todo by other user', (done) => {
        request(app)
            .get(`/todos/${todo[1]._id.toHexString()}`)
            .set('x-auth', user[0].tokens[0].token)
            .expect(400)
            .end(done);
        
    })
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}+'1'`)
            .set('x-auth', user[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
    it('should return 404 if todo non object', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', user[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})

describe('DELETE /todos', () => {
    it('should delete todo', (done) => {
        const hexId = todo[1]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', user[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.data._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                ToDo.findById(hexId)
                    .then((result) => {
                        expect(result).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })
    it('should not delete todo by other user', (done) => {
        const hexId = todo[0]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', user[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                ToDo.findById(hexId)
                    .then((result) => {
                        // expect(result).toExist();
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${id}+'1'`)
            .set('x-auth', user[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
    it('should return 404 if todo non object', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', user[0].tokens[0].token)
            .expect(404)
            .end(done);
    })
})


describe('PUT/ todo/id', () => {
    it('should todo update', (done) => {
        const id = todo[1]._id;
        const text = 'beko'
        request(app)
            .put(`/todos/${id}`)
            .set('x-auth', user[1].tokens[0].token)
            .send({ text, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toEqual(text)
                expect(res.body.data.completed).toBeTruthy()
                // expect(res.body.data.completedAt).to.be.a('number')
            })
            .end(done);
    })
    it('not should  update todo by other user', (done) => {
        const id = todo[0]._id;
        const text = 'beko'
        request(app)
            .put(`/todos/${id}`)
            .set('x-auth', user[1].tokens[0].token)
            .send({ text, completed: true })
            .expect(404)
            .end(done);
    })
    it('should completedAt clear when not completed', (done) => {
        const id = todo[0]._id;
        const text = 'beko hilal'
        request(app)
            .put(`/todos/${id}`)
            .set('x-auth', user[0].tokens[0].token)
            .send({ text, completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.data.text).toEqual(text)
                expect(res.body.data.completed).toBe(false)
                expect(res.body.data.completedAt).toBeNull()
                // expect(res.body.data.completedAt).toNotExist()
            })
            .end(done);
    })
})