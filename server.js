const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;

const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));



server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
