var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'nodetest@yahoo.com',
    pass: 'mgupzboehstywezp'
  }
});

var mailOptions = {
  from: 'nodetest@yahoo.com',
  to: 'rares.petrisor1@gmail.com',
  subject: 'Welcome to TravelMap',
  text: 'Welcome to TravelMap!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});