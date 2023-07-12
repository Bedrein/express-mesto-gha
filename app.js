const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64ab2282ef6cc45248091b02',
  };

  next();
});

app.use('/', userRoutes);
app.use('/', cardRoutes);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Страница отсутствует' });
});

app.listen(PORT, () => {
  console.log(`Add listening on port ${PORT}`);
});
