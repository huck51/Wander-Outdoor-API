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
  const { firstName, lastName, DOB, email, phone, username, password } = req.body;
  const newTraveler = new Traveler({ firstName, lastName, DOB, email, phone, username, password });
  newTraveler.save((err, newTraveler) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message});
    } else {
      res.json(newTraveler);
    }
  });
});

server.post('/signup/guide', (req, res) => {
  const { firstName, lastName, companyName, companyCode, email, phone, DOB, username, password, bio, certs } = req.body;
  const newGuide = new Guide({ firstName, lastName, companyName, companyCode, email, phone, DOB, username, password, bio, certs });
  newGuide.save((err, newGuide) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      res.json(newGuide);
    }
  });
});

server.post('/signup/guiding-company', (req, res) => {
  const { companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, email, password } = req.body;
  const newCompany = new Company({ companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, email, password });
  newCompany.save((err, newCompany) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      res.json(newCompany);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
