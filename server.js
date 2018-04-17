const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const server = express();

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/wander', { useMongoClient: true });

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.get('/', (req, res) => {
  res.send('SERVES UP DOOD');
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
