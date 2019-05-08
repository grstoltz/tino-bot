require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  `mongodb+srv://${process.env.MONGOUSERNAME}:${
    process.env.MONGOPASSWORD
  }@cluster0-yep2z.gcp.mongodb.net/test?retryWrites=true`,
  { useNewUrlParser: true }
);

const Message = require('./models/Message');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const PORT = 8080 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res, next) => {
  res.send('hello');
});

app.get('/api/message', async (req, res, next) => {
  Message.aggregate([{ $sample: { size: 1 } }]).then(result =>
    res.send(result)
  );
});

app.post('/api/message', async (req, res, next) => {
  Message.create({ message: req.body.message }).then(result =>
    res.send(result)
  );
});

app.post('/api/delete/message', async (req, res, next) => {
  Message.deleteOne({ _id: req.body.id }).then(result => res.send(result));
});
module.exports = {
  app
};
