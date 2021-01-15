const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const toDoSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength:100
    },
    completed: {
        type: Boolean,
        default:false
    },
    completedAt: {
        type: Number,
        default:null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        require:true
        
    }
    // ,
    // expire_at: {
    //     type: Date,
    //     default: Date.now,
    //     expires: 10
    // }
})


//  7200 =2 houres
//  expire_at: {type: Date, default: Date.now, expires: 10} 
toDoSchema.index({ "expire_at": 1 }, { expireAfterSeconds: 10 });
const ToDo = mongoose.model('ToDo', toDoSchema)

module.exports = ToDo;