const User = require('../modules/user');
const _=  require('lodash')


// registerUser
const registerUser = async (req, res) => {
    const body = _.pick(req.body,['email','password'])
    const user = await new User(body);
    user.save()
        .then((user) => {
            return user.generateAuthToken()
        })
        .then((token) => {
            res.header('x-auth',token).send(user);
        })
        .catch((err) => {
            res.status(400).send(err)
        })
}


//  get once to do
const getUser =  (req, res) => {
        res.send(req.user)
}

// loginUser
const loginUser =  async (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
      await User.findByCredentials(body.email, body.password)
         .then((user) => {
             return user.generateAuthToken().then((token) => {
                 res.header('x-auth', token).send(user);
             });
            })
         .catch((err)=>{res.status(400).send(err)})
}

//  deleteUser

const deleteUser = (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200).send()
        }, () => {
                res.status(400).send()
        })
}

module.exports = {
    registerUser,
    loginUser,
    deleteUser,
    getUser

}