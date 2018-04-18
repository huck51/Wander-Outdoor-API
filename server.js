const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5001;
const Traveler = require('./Models/travelerModel');
const Guide = require('./Models/guideModel');
const Company = require('./Models/companyModel');
const Trip = require('./Models/tripModel');

const server = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.get('/', (req, res) => {
  res.send('SERVES UP DOOD');
});

server.post('/signup/traveler', (req, res) => {
  const body = req.body;
});

server.post('/signup/guide', (req, res) => {
  const body = req.body;
});

server.post('/signup/guiding-company', (req, res) => {
  const body = req.body;
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
