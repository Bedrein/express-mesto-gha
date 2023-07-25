const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const router = require('./routes');

const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Add listening on port ${PORT}`);
});
