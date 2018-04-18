const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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

server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use(cors());

server.get('/', (req, res) => {
  res.send('SERVES UP DOOD');
});

server.get('/guides', (req, res) => {
  Guide.find({}, (err, allGuides) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allGuides);
      res.json(allGuides);
    }
  });
});

server.get('/guiding-companies', (req, res) => {
  Company.find({}, (err, allCompanies) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allCompanies);
      res.send(allCompanies);
    }
  });
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
  const { companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, contactEmail, password } = req.body;
  const newCompany = new Company({ companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, contactEmail, password });
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
