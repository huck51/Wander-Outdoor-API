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
  const newTraveler = {
    firstName: body.firstName,
    lastName: body.lastName,
    DOB: body.DOB,
    email: body.email,
    phone: body.phone,
    username: body.username,
    password: body.password
  };
});

server.post('/signup/guide', (req, res) => {
  const body = req.body;
  const newGuide = {
    firstName: body.firstName,
    lastName: body.lastName,
    companyName: body.companyName,
    companyCode: body.companyCode,
    email: body.email,
    phone: body.phone,
    DOB: body.DOB,
    username: body.username,
    password: body.password,
    bio: body.bio,
    certs: body.certs
  };
});

server.post('/signup/guiding-company', (req, res) => {
  const body = req.body;
  const newCompany = {
    companyName: body.companyName,
    companyAddress: body.companyAddress,
    companyPhone: body.companyPhone,
    contactName: body.contactName,
    jobTitle: body.jobTitle,
    contactPhone: body.contactPhone,
    email: body.email,
    password: body.password
  };
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
