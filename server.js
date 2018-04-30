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

server.get('/guide/:id', (req, res) => {
  const _id = req.params;
  console.log(id);
  Guide.findOne({_id}, (err, guide) => {
    if (err) {
      console.error(err);
      return res.status(422).json({stack: err.stack, message: err.message});
    } else {
      return res.status(200).send(guide);
    }
  });
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

server.get('/trips', (req, res) => {
  Trip.find({}, (err, allTrips) => {
    if (err) {
      return res.status(422).send(err);
    } else {
      return res.status(200).send(allTrips);
    }
  });
});

server.get('/results', (req, res) => {
  Company.find({}, (err, allCompanies) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allCompanies);
      res.send(allCompanies);
    }
  })
});

server.post('/add-trip', (req, res) => {
  const { name, location, description, price, company } = req.body;
  const newTrip = new Trip({ name, location, description, price, company });
  newTrip.save((err, newTrip) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(newTrip);
      res.json(newTrip);
    }
  });
});

server.post('/login', (req, res) => {
  const { username, password } = req.body;
  Traveler.find({ username }, (err, user) => {
    if (err) {
      res.json({ loggedIn: false });
    } else {
      console.log(user);
      if (user.length > 0 && user[0].username === username && user[0].password === password) {
        res.json({ loggedIn: true });
      } else {
        res.json({ loggedIn: false });
      }
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
      console.log(newTraveler);
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
  const rando = (min, max) => {
    return Math.random() * (max - min) + min;
  }
  const code = rando(100000000, 999999999);
  console.log(code);
  const { companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, contactEmail, password } = req.body;
  const newCompany = new Company({ companyName, companyAddress, companyPhone, contactName, jobTitle, contactPhone, contactEmail, password, companyCode: code });
  newCompany.save((err, newCompany) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(newCompany);
      res.json(newCompany);
    }
  });
});

server.post('/remove-guide', (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  Guide.findByIdAndRemove(id, (err, guide) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      console.log(guide);
      res.status(200).send(guide);
    }
  });
});

server.post('/remove-trip', (req, res) => {
  const { id } = req.body;
  Trip.findByIdAndRemove(id, (err, trip) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      res.status(200).send(trip);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
