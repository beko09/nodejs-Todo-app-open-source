const ToDo = require('../modules/todo');
const {ObjectID} = require('mongodb')
const _ = require('lodash');

//  add todo
const addTodo = async (req, res) => {
    const todo = await new ToDo({
        text: req.body.text,
        // completed: req.body.completed,s
        // completedAt: req.body.completedAt,
        _creator:req.user._id
    });
    todo.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(400).send(JSON.stringify(err))
        })
}

//  get all to do
const getTodos =async (req, res) => {
    await ToDo.find({
        _creator: req.user._id
    })
        .then((data) => {
            res.send({data})
        })
        .catch((err)=>res.status(400).send(err))
}

//  get once to do
const getTodo = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    await ToDo.findOne({
        _id: id,
        _creator: req.user._id
    })
        .then((data) => {
            if (!data) {
                return res.status(400).send()
            }
            res.send({data})
        })
        .catch((err)=>res.status(400).send(err))
}
//  update once to do
const updateTodo = async (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed'])
    
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }else {
        body.completed = false,
        body.completedAt= null    
    }
    await ToDo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id}, {$set:body}, { new: true })
        .then((data) => {
            if (!data) {
                return res.status(404).send(JSON.stringify("not found"))
            }
            res.send({data})
        })
        .catch((err)=>res.status(400).send(err))
}
//  delete once to do
const deleteTodo = async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    await ToDo.findOneAndDelete({
        _id: id,
        _creator: req.user._id
    })
        .then((data) => {
            if (!data) {
                return res.status(404).send(JSON.stringify("not found"))
            }
            res.send({data})
        })
        .catch((err)=>res.status(400).send(err))
}

module.exports = {
    addTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo

}