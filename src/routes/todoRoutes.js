const express = require('express');
const toDo = require('../controllers/todoController')
const router = express.Router();
const authenticate = require('../middleware/authenticate')

//  todo router
router.post('/', authenticate, toDo.addTodo)
router.get('/', authenticate, toDo.getTodos);
router.get('/:id', authenticate, toDo.getTodo)
router.delete('/:id', authenticate, toDo.deleteTodo)
router.put('/:id', authenticate, toDo.updateTodo)


module.exports = router;
