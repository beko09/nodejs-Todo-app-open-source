const mongoose = require('mongoose');
const url = process.env.MONGODB_URL;

mongoose.Promise = global.Promise
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false })
module.exports = mongoose;