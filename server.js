const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Pwgen = require('pwgen');
const cloudinary = require('cloudinary');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5001;
const Traveler = require('./Models/travelerModel');
const Guide = require('./Models/guideModel');
const Company = require('./Models/companyModel');
const Trip = require('./Models/tripModel');
const User = require('./Models/userModel');
const Message = require('./Models/messageModel');
const axios = require('axios');

const server = express();

cloudinary.config({
  cloud_name: 'wander-outdoor',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const mongOptions = {
  poolSize: 10,
}
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, mongOptions);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    next();
});

server.use(cors());

server.get('/', (req, res) => {
  res.send('SERVES UP DOOD');
});

const searchAll = (tags) => {
  models = [Company, User, Trip];
  const t = tags.pop();
  console.log(tags);
  console.log(t);
  return Promise.all(models.map(model => model.find({ $or: [{ 'tags': { $all: tags} }, { 'tags': t }] }, { firstName: 1, lastName: 1, companyName: 1, roleGroup: 1, city: 1, state: 1, stateName: 1, picture: 1, name: 1, company: 1 })));
};
//smtpout.secureserver.net
server.post('/cloudinary', (req, res) => {
  const params_to_sign = req.body.paramsToSign;
  params_to_sign.timestamp = Date.now();
  console.log(params_to_sign);
  const sig = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUDINARY_API_SECRET);
  console.log(sig);
  if (sig) {
    res.status(200).json(sig);
  } else {
    res.status(422);
  }
});

server.post('/request-trip', (req, res) => {
  const tripRequest = req.body;
  console.log(tripRequest);
  const transporter = nodemailer.createTransport({
    service: 'Office365',
    host: 'smtp.office365.com',
    secureConnection: true,
    port: 587,
    auth: {
      user: 'info@wanderoutdoor.co',
      pass: process.env.NODEMAIL_KEY,
    },
  });

  const mailOptions = {
    from: 'info@wanderoutdoor.co',
    to: tripRequest,
    subject: 'New Trip Request!',
    text: '',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(422).send(error);
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send(info.response);
    }
  });
});

server.post('/find-user', (req, res) => {
  const { id } = req.body;
  console.log(id);
  User.findOne({ id }, (err, foundUser) => {
    if (err) {
      return res.status(422).send(err);
    }
    if (foundUser) {
      console.log(foundUser);
      return res.status(200).json(foundUser);
    }
  });
});

server.get('/company/:companyName', (req, res) => {
  const { companyName } = req.params;
  console.log(companyName);
  Company.findOne({ companyName }, (err, company) => {
    if (err) {
      console.error(err);
      return res.status(422).json({stack: err.stack, message: err.message});
    } else {
      console.log(company);
      return res.status(200).send(company);
    }
  });
});

server.post('/dashboard-companies', (req, res) => {
  const { id } = req.body;
  console.log(id);
  User.findOne({ id }, (err, foundUser) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (foundUser) {
      console.log('foundUser');
      Company.find({ owner: foundUser._id }, (err, companies) => {
        if (err) {
          console.log(err);
          return res.status(422).send(err);
        }
        if (companies) {
          console.log(companies);
          return res.status(200).json(companies);
        }
      });
    }
  });
});

server.get('/guides', (req, res) => {
  User.find({ roleGroup: 'guide' }, { firstName: 1, lastName:1, companyName: 1, city: 1, state: 1, roleGroup: 1, picture: 1, id: 1, _id: 0 }, (err, allGuides) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allGuides);
      res.json(allGuides);
    }
  });
});

server.get('/guides/:company', (req, res) => {
  const companyName = req.params.company;
  console.log(companyName);
  Company.findOne({ companyName }, (err, foundCompany) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (foundCompany) {
      const { companyCode } = foundCompany;
      User.find({ companyCode }, (err, companies) => {
        if (err) {
          console.log(err);
          return res.status(422).send(err);
        }
        if (companies) {
          return res.status(200).json(companies);
        }
      });
    }
  });
});

server.get('/guides/:username', (req, res) => {
  const { username } = req.params;
  Guide.findOne({ username }, (err, guide) => {
    if (err) {
      res.status(422).json({ stack: err.stack, message: err.message });
    } else {
      res.status(200).send(guide);
    }
  });
});

server.get('/guiding-companies', (req, res) => {
  Company.find({}, { companyName: 1, city: 1, stateName: 1, picture: 1 }, (err, allCompanies) => {
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

server.get('/trips/:company', (req, res) => {
  const { company } = req.params;
  Trip.find({ company }, (err, trips) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (trips) {
      return res.status(200).json(trips);
    }
  });
});

server.get('/trip/:id', (req, res) => {
  console.log('hello');
  const { id } = req.params;
  console.log(id);
  Trip.findOne({ _id: id }, (err, trip) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (trip) {
      return res.status(200).json(trip);
    }
  });
});

server.get('/results/:search', (req, res) => {
  const  { search } = req.params;
  const searchParams = search.toLowerCase().split(' ');
  searchParams.push(searchParams.join(' '));
  searchAll(searchParams)
  .then((result) => {
    const cat = result[0].concat(result[1]).concat(result[2]);
    console.log(cat);
    res.status(200).json(cat);
  })
  .catch((error) => {
    console.log(error);
  });

});

server.post('/add-trip', (req, res) => {
  const {
    name,
    city,
    stateName,
    description,
    price,
    company,
    picture,
    chex,
  } = req.body;
  const tags = ['trip', name.toLowerCase(), city.toLowerCase(), stateName.toLowerCase(), price.toLowerCase(), company.toLowerCase()].concat(chex.map(check => { return check.toLowerCase(); }));
  const newTrip = new Trip({
    name,
    city,
    stateName,
    description,
    price,
    company,
    picture,
    chex,
    tags
  });
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
  const code = Math.floor(rando(100000000, 999999999)).toString();
  console.log(code);
  const {
    companyName,
    streetAddress,
    city,
    stateName,
    zipCode,
    companyPhone,
    contactName,
    jobTitle,
    contactPhone,
    contactEmail,
    bio,
    chex,
    picture,
    owner,
  } = req.body;
  const companyCode = companyName + code;
  const tags = [companyName.toLowerCase(), city.toLowerCase(), stateName.toLowerCase(), zipCode].concat(chex.map(check => { return check.toLowerCase(); }));
  User.findOne({ id: owner }, (err, foundUser) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (foundUser) {
      const newCompany = new Company({
        companyName,
        streetAddress,
        city,
        stateName,
        zipCode,
        companyPhone,
        contactName,
        jobTitle,
        contactPhone,
        contactEmail,
        companyCode,
        bio,
        chex,
        tags,
        picture,
        owner: foundUser._id
      });
      newCompany.save((err, newCompany) => {
        if (err) {
          res.status(422);
          res.json({ stack: err.stack, message: err.message });
        } else {
          console.log(newCompany);
          res.json(newCompany);
        }
      });
    }
  });
});

server.post('/update/guiding-company', (req, res) => {
  const { updateObject } = req.body;
  updateObject.roleGroup = 'company';
  updateObject.tags = [updateObject.companyName.toLowerCase(), updateObject.city.toLowerCase(), updateObject.stateName.toLowerCase(), updateObject.zipCode, 'company'].concat(updateObject.chex.map(check => { return check.toLowerCase(); }));
  const id = updateObject.owner;
  delete updateObject.owner;
  User.findOne({ id }, (err, foundOwner) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (foundOwner) {
      const owner = foundOwner._id;
      Company.findOneAndUpdate({ owner }, updateObject, (err, updatedCompany) => {
        if (err) {
          console.log(err);
          return res.status(422).send(err);
        }
        if (updatedCompany) {
          return res.status(200).json(updatedCompany);
        }
      });
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

server.post('/signup-newuser', (req, res) => {
  const { id, email } = req.body;
  User.findOne({ id }, (err, foundUser) => {
    if (err) {
      console.log(err);
      const newUser = new User({ id, email });
      newUser.save((err, newUser) => {
        if (err) {
          console.log('if err');
          console.log(err);
          return res.status(422).send(err);
        }
        if (newUser) {
          return res.status(200).json(newUser);
        }
      });
    }
    if(!foundUser) {
      const newUser = new User({ id, email });
      newUser.save((err, newUser) => {
        if (err) {
          console.log('if !foundUser');
          console.log(err);
          return res.status(422).send(err);
        }
        if (newUser) {
          return res.status(200).json(newUser);
        }
      });
    }
    if (foundUser) {
      return res.status(200).json(foundUser);
    }
  })
});

server.post('/contact-message', (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = new Message({ name, email, message });
  console.log(newMessage);
  newMessage.save((err, newMessage) => {
    if (err) {
      return res.status(422).send(err);
    }
    if (newMessage) {
      console.log(newMessage);
      return res.status(200).send(newMessage);
    }
  });
});

server.post('/update-profile', (req, res) => {
  const {
    firstName,
    lastName,
    DOB,
    email,
    phone,
    roleGroup,
    picture,
    id,
    bio,
    companyCode,
    city,
    state,
    chex,
  } = req.body;
  const tags = [firstName.toLowerCase(), lastName.toLowerCase(), roleGroup.toLowerCase(), city.toLowerCase(), state.toLowerCase()].concat(chex.map(check => { return check.toLowerCase(); }));
  const updateObject = {
    firstName,
    lastName,
    DOB,
    email,
    phone,
    roleGroup,
    picture,
    id,
    bio,
    companyCode,
    city,
    state,
    chex,
    tags,
  };
  User.findOneAndUpdate({ id: updateObject.id }, updateObject, (err, updatedUser) => {
    if (err) {
      res.status(422).send(err);
    }
    if (updatedUser) {
      if (updatedUser.roleGroup === 'guide' && updatedUser.companyCode && !updatedUser.companyEmail) {
        const mergerPackage = {
          companyCode: updatedUser.companyCode,
          userId: updatedUser._id,
        };
        axios.post('https://fierce-ridge-55021.herokuapp.com/append/email/toUser', {mergerPackage})
          .then((response) => {
            return;
          })
          .catch((error) => {
            console.log(error);
            return;
          });
      }
      res.status(200).json(updatedUser);
    }
  });
});

server.post('/append/email/toUser', (req, res) => {
  const { companyCode, _id } = req.body.mergerPackage;
  console.log(companyCode);
  Company.findOne({ companyCode }, (err, foundCompany) => {
    if (err) {
      console.log(err);
      return res.status(503).send(err);
    }
    if (foundCompany) {
      const companyEmail = foundCompany.contactEmail;
      const { companyName } = foundCompany;
      User.findOneAndUpdate({ _id }, { $set: { companyEmail: companyEmail, companyName: companyName} }, (err, updatedUser) => {
        if (err) {
          console.log(err);
          return res.status(503).send(err);
        }
        if (updatedUser) {
          console.log(updatedUser);
          return res.status(200).send('success');
        }
      });
    }
  });
  return res.status(200).json('Success');
});

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
