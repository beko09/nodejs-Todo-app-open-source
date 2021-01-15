const expect = require('expect');
const request = require('supertest');
const app = require('../app');
const User = require('../modules/user');
const { user, populateUser } = require('./dbtest/dbtest')


beforeEach(populateUser);

describe('GET /users/me', () => {
    it('should user is auth', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', user[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(user[0]._id.toHexString());
                expect(res.body.email).toBe(user[0].email);
                // expect(res.body.tokens).toBe(user[0].tokens[0].token);
            })
            .end(done);
    });
    it('should return 401 if not aut', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', user[0].tokens[0].token + '1')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
})

describe('POST/users/register', () => {
    it("should create user", (done) => {
        const email = 'test@gmail.com';
        const password = '12345678';
        request(app)
            .post('/users/register')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();//toExist
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);

            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email })
                    .then((user) => {
                        expect(user).toBeTruthy()//toExist
                        // expect(user.password).to.Not.Be(password)//toNotBe
                        done();
                    })
                    .catch((err) => {
                        done(err);
                    })
            });
    })

    it('should return validate error if not valid email', (done) => {
        const email = 'mail.com';
        const password = '678';
        request(app)
            .post('/users/register')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done);
    });
    it('should not create user if email uses', (done) => {
        const email =user[0].email;
        const password = "123445567"
        request(app)
            .post('/users/register')
            .send({email,password})
            .expect(400)
            .end(done);
    })
})


describe("POST /users/login", () => {
    it('should login user & return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: user[1].email,
                password: user[1].password,
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy()// toExist
                // expect(res.body._id).toBe(user[1]._id.toHexString())
                // expect(res.body.email).toBe(user[1].email)
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(user[1]._id)
                    .then((user) => {
                        // expect(user.tokens[0]).toInclude({ //toInclude
                        //     access: 'auth',
                        //     token: res.headers['x-auth']
                        // });
                        done();
                    })
                    .catch((err) => done(err))
            })
    });
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: user[1].email,
                password: user[1].password + "4",
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy()// toNotExist
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(user[1]._id)
                    .then((users) => {
                        expect(users.tokens.length).toBe(1);
                        done();
                    })
                    .catch((err) => done(err))
            })
    });
  
});

 describe('DELETE /users/me/token',()=>{
    it('should delete auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth' , user[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }
                User.findById(user[0]._id)
                    .then((users) => {
                        expect(users.tokens.length).toBe(0);
                        done();
                    })
                    .catch((err) => done(err))
            })
    })
})