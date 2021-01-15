require('./config/config');
const express = require('express');
require('./db/mongooes');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const toDoRouter = require('./routes/todoRoutes');

//  middleware & static file
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//  port
const port = process.env.PORT
//  listen port
app.listen(port)

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect('/todos');
})

//  to router
app.use('/users', userRouter)
app.use('/todos', toDoRouter)




module.exports = app;



