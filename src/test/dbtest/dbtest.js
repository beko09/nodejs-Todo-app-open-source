const ToDo = require('../../modules/todo');
const User = require('../../modules/user');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken')

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const user = [
    {
    _id: userOneId,
    email: 'beko09@gmail.com',
    password: '123456',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
    
    },
    {
    _id: userTwoId,
    email: 'beko0909@gmail.com',
    password: '123456!',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId.toHexString(), access: 'auth' }, process.env.JWT_SECRET).toString()
    }]
    
    }
]
const todo = [{
    _id: new ObjectID(),
    text: 'hello text',
    _creator:userOneId
}, {
    _id: new ObjectID(),
    text: 'hello text 2',
    completed: true,
        completedAt: 333,
        _creator:userTwoId
}]
const populateTodos = (done) => {
    ToDo.remove({}).then(() => {
        return ToDo.insertMany(todo);
    }).then(() => done())
}
const populateUser = (done) => {
    User.remove({}).then(() => {
        const userOne = new User(user[0]).save();
        const userTwo = new User(user[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done())
}

module.exports = {
    todo,
    populateTodos,
    user,
    populateUser
}