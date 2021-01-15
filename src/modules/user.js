const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { populateUser } = require('../test/dbtest/dbtest');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique:true,
        validate: {
            validator: validator.isEmail,
            message:"{value} is not valid email"
        }
    },
    password: {
        type: String,
        require: true,
        minlength:6
    },
    tokens: [{
        access: {
            type: String,
            require: true,
        },
        token: {
            type: String,
            require: true,
        }
    }]
   
});


userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject,['_id','email'])
}

userSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET).toString();
    user.tokens.push({ access, token });
    return user.save().then(() => {
            return token;
        })
};

userSchema.methods.removeToken = function (token) {
    const user = this;
   return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

userSchema.statics.findByToken = async function (token) {
    const user = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
        return  Promise.reject();
    }
    return await user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
        
    })
};


userSchema.statics.findByCredentials =  function (email, password) {
    const User = this;
    return User.findOne({ email })
        .then((user) => {
            if(!user) {
                return Promise.reject();
            }
            return new Promise((resolve, reject) => {
                //  use bcrypt compare to compare password to user.password
                bcrypt.compare(password, user.password, (err, res) => {
                    if (res) {
                        resolve(user);
                    } else {
                        reject();
                    }
                });

            });
        });
};

userSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})



const User = mongoose.model('User', userSchema)

module.exports = User;