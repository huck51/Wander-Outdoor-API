const axios = require('axios');
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary');
const Company = require('./Models/companyModel');
const cors = require('cors');
const express = require('express');
const Guide = require('./Models/guideModel');
const ManagementClient = require('auth0').ManagementClient;
const Message = require('./Models/messageModel');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5001;
const Pwgen = require('pwgen');
const stripe = require('stripe')(process.env.STRIPEKEY);
const Traveler = require('./Models/travelerModel');
const Trip = require('./Models/tripModel');
const User = require('./Models/userModel');


const server = express();

cloudinary.config({
  cloud_name: 'wander-outdoor',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const mongOptions = {
  auth: {
    user: process.env.MONGO_USER,
    password: process.env.MONGO_P,
  },
  poolSize: 10,
};
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI, mongOptions)
  .then(() => {
    // console.log(mongoose.connection);
  })
  .catch(err => {
    console.log(err);
    // console.log(mongoose.connection);
  });


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    next();
});

server.use(cors());

server.get('/', (req, res) => {
  res.send('SERVES UP DOOD');
});

const escapeRegex = text => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchAll = (tags) => {
  const models = [Company, User, Trip];
  return Promise.all(models.map(model => model.find({ 'tags': { $in: tags } }, { score: { $meta: 'textScore' } } ).sort({ score: { $meta: 'textScore' } })));
};
//smtpout.secureserver.net

const authZeroProcess = () => {
  const options = {
    method: 'POST',
    url: 'https://wander-outdoor.auth0.com/oauth/token',
    headers: {
      'content-type': 'application/json'
    },
    data: {
      "client_id": process.env.A0CLIENTID,
      "client_secret": process.env.A0CLIENTSECRET,
      "audience":"https://wander-outdoor.auth0.com/api/v2/",
      "grant_type":"client_credentials"
    }
  };

  axios(options)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.log(error);
  });
};

const processInterval = () => {
  setInterval(authZeroProcess, 3600000);
};
processInterval();

server.get('/testy-puller', (req, res) => {
  const options = {
  method: 'POST',
  url: 'https://wander-outdoor.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  data: {
    "client_id": process.env.A0CLIENTID,
    "client_secret": process.env.A0CLIENTSECRET,
    "audience":"https://wander-outdoor.auth0.com/api/v2/",
    "grant_type":"client_credentials"
  }
  };
  axios(options)
  .then(response => {
    return res.status(200).send(response.data);
  })
  .catch(error => {
    console.log(error);
    console.log('ERROR-ERROR-ERROR');
    return res.status(422).send('error');
  });
});

/*=======================================================
============= COMPANY ROUTES ============================
=======================================================*/

server.post('/add-guides-to-company', (req, res) => {
  const { companyCode, guides } = req.body;
  Company.findOne({ companyCode }, (err, company) => {
    if (err) {
      console.error(err);
      return res.status(422).json({stack: err.stack, message: err.message});
    }
    if (company) {
      company.guides.push(guides);
      company.save();
      return res.status(200).send('Success');
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

server.get('/company/guides/:companyCode', (req, res) => {
  const { companyCode } = req.params;
  Company.findOne({ companyCode }).
    populate('guides').
    exec((err, foundCompany) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (foundCompany) {
      return res.status(200).json(foundCompany.guides);
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

server.get('/guiding-companies', (req, res) => {
  Company.find({}, { companyName: 1, city: 1, stateName: 1, picture: 1, rating: 1, roleGroup: 1 }, (err, allCompanies) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allCompanies);
      res.send(allCompanies);
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

/*=======================================================
============= USER ROUTES ===============================
=======================================================*/
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

server.get('/guides', (req, res) => {
  User.find({ roleGroup: 'guide' }, { firstName: 1, lastName:1, name: 1, companyName: 1, companyEmail: 1, city: 1, stateName: 1, roleGroup: 1, picture: 1, id: 1, rating: 1, _id: 0 }, (err, allGuides) => {
    if (err) {
      res.status(422);
      res.json({ stack: err.stack, message: err.message });
    } else {
      console.log(allGuides);
      res.json(allGuides);
    }
  });
});

server.get('/guides/:companyCode', (req, res) => {
  const { companyCode } = req.params;
  User.find({ companyCode }, (err, guides) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (guides) {
      const filteredGuides = [];
      for (let i = 0; i < guides.length; i++) {
        if (!(guides[i].company)) {
          filteredGuides.push(guides[i]);
        }
      }
      return res.status(200).json(filteredGuides);
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
    stateName,
    chex,
  } = req.body;
  const tags = [firstName.toLowerCase(), lastName.toLowerCase(), roleGroup.toLowerCase(), city.toLowerCase(), stateName.toLowerCase()].concat(chex.map(check => { return check.toLowerCase(); }));
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
    stateName,
    chex,
    tags,
    name: `${firstName} ${lastName}`,
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

/*=======================================================
============= STRIPE ROUTES =============================
=======================================================*/

server.post('/create/customer', (req, res) => {
  console.log('create customer: ');
  console.log(req.body);
  const { email, fierceIce, source } = req.body;
  stripe.customers.create({
    email,
    source: source.id,
  }, (err, customer) => {
    if (err) {
      console.log(err);
    }
    if (customer) {
      console.log(customer);
      const customerId = customer.id;
      // TO-DO: Save customerId to MONGODB_URI
      stripe.subscriptions.create({
        customer: customerId,
        items: [{plan: 'plan_Dkcc4ylrXTx2Wo'}],
      }, (err, subscription) => {
        if (err) {
          console.log(err);
        }
        if (subscription) {
          console.log(subscription);
          const updateObj = {
            customer: customerId,
            subscribed: true,
          };
          console.log(fierceIce);
          console.log(customerId);
          User.findOneAndUpdate({id: fierceIce}, updateObj, (err, foundUser) => {
            if (err) {
              console.log(`findUserAndUpdate function ${route} ${err}`);
            }
            if (foundUser) {
              console.log(foundUser);
            }
          });
        }
      });
    }
  });
  res.status(200).send('sucess');
});

/*=======================================================
============= TRIP ROUTES ===============================
=======================================================*/

server.post('/add-trip', async (req, res) => {
  const {
    name,
    city,
    stateName,
    description,
    price,
    companyCode,
    picture,
    chex,
    guides,
    tripUrl
  } = req.body;
  const parentCompany = await Company.findOne({ companyCode }, (err, foundCompany) => {
    if (err) {
      console.log(err);
      return null;
    }
    if (foundCompany) {
      return foundCompany;
    }
  });
  const tags = ['trip', name.toLowerCase(), city.toLowerCase(), stateName.toLowerCase(), price.toLowerCase(), parentCompany.companyName.toLowerCase()].concat(chex.map(check => { return check.toLowerCase(); }));
  const newTrip = new Trip({
    name,
    city,
    stateName,
    description,
    price,
    companyName: parentCompany.companyName,
    picture,
    chex,
    tags,
    company: parentCompany._id,
    companyCode,
    guides,
    tripUrl
  });
  parentCompany.trips.push(newTrip._id);
  parentCompany.save((err, success) => {
    if (err) {
      console.log(err);
    }
    if (success) {
      console.log(success);
    }
  });
  newTrip.save((err, newTrip) => {
    if (err) {
      res.status(422).json({ stack: err.stack, message: err.message });
    } else {
      console.log(newTrip);
      if (newTrip.guides.length > 0) {
        User.find({ _id: { $in: newTrip.guides } }, (err, guides) => {
          if (err) {
            console.log(err);
          }
          if (guides) {
            for (let i = 0; i < guides.length; i++) {
              guides[i].tripsQualified.push(newTrip._id);
              guides[i].save().
                then((guide) => {
                  console.log(`Updated and saved ${guide.name}`);
                }).
                catch((err) => {
                  console.log(err);
                });
            }
          }
        });
      }
      res.status(200).json(newTrip);
    }
  });
});

server.post('/edit-trip', (req, res) => {
   const {
     id,
     name,
     description,
     city,
     stateName,
     price,
     picture,
     chex,
     companyName,
     tripUrl,
     guides,
   } = req.body;
   const tags = ['trip', name.toLowerCase(), city.toLowerCase(), stateName.toLowerCase(), price.toLowerCase(), companyName.toLowerCase()].concat(chex.map(check => { return check.toLowerCase(); }));
   const updateTrip = {
     id,
     name,
     description,
     city,
     stateName,
     price,
     picture,
     chex,
     companyName,
     tripUrl,
     guides,
     tags,
   };
   Trip.findByIdAndUpdate(id, updateTrip, (err, updatedTrip) => {
     if (err) {
       console.log(err);
       return res.status(422).send('Error');
     }
     if (updatedTrip) {
       console.log(updatedTrip);
       return res.status(200).send('Success');
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
  const companyCode = req.params.company;
  Trip.find({ companyCode }, (err, trips) => {
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
  const { id } = req.params;
  Trip.findOne({ _id: id }).
    populate('guides', 'name _id').
    populate({
      path: 'company',
      select: 'guides',
      populate: {
        path: 'guides',
        select: 'name _id',
      },
    }).
    exec((err, trip) => {
    if (err) {
      console.log(err);
      return res.status(422).send(err);
    }
    if (trip) {
      console.log(trip);
      return res.status(200).json(trip);
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
    to: 'ejallen2@wisc.edu',
    subject: 'New Trip Request!',
    text: `Hello ${tripRequest.companyName}, ${tripRequest.firstName} ${tripRequest.lastName} is interested in booking ${tripRequest.trip} with ${tripRequest.guide} as thier guide! This trip is for ${tripRequest.numPeople}. They would like to book it for ${tripRequest.departure}. Please reach out to them by email at ${tripRequest.email} and/or by phone at ${tripRequest.phone} to confirm the details of their trip. Wander on. -Your friends at Wander Outdoor`,
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

/*=======================================================
============= OTHER ROUTES ==============================
=======================================================*/

server.post('/append/email/toUser', (req, res) => {
  const { companyCode } = req.body.mergerPackage;
  const _id = req.body.mergerPackage.userId;
  console.log(_id);
  Company.findOne({ companyCode }, (err, foundCompany) => {
    if (err) {
      console.log(err);
      return res.status(503).send(err);
    }
    if (foundCompany) {
      console.log('so far so good');
      const companyEmail = foundCompany.contactEmail;
      const { companyName } = foundCompany;
      console.log(_id);
      User.findOneAndUpdate({ _id }, { $set: { companyEmail: companyEmail, companyName: companyName} }, (err, updatedUser) => {
        if (err) {
          console.log('err');
          // return res.status(503).send(err);
        }
        if (updatedUser) {
          console.log(updatedUser);
          // return res.status(200).send('success');
        }
      });
    }
  });
  return res.status(200).json('Success');
});

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

server.post('/contact-message', (req, res) => {
  const { name, email, message } = req.body;
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
    to: 'info@wanderoutdoor.co',
    subject: 'Contact Message',
    text: `Sender Name: ${name} \n Sender Email: ${email} \n Sender Message: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(422).send(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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

server.get('/results', (req, res) => {
  const  { search } = req.query;
  console.log(search);
  if (search === 'Everything') {
    var searchParams = [/\w+/g];
  } else {
    var searchParams = search.toLowerCase().split(' ');
    searchParams.push(searchParams.join(' '));
    for (let i = 0; i < searchParams.length; i++) {
      searchParams[i] = new RegExp(escapeRegex(searchParams[i]), 'gi');
    }
  }
  console.log(searchParams);
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

server.listen(PORT, () => {
  console.log(`Servs up dude ${PORT}`);
});
