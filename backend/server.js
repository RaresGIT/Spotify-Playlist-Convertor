
const googleapp = require('../backend/googleapp/app');
const spotifyapp = require('../backend/spotifyapp/app');
const userloginapp = require('../backend/userloginapp/app');

// set port, listen for requests
const PORT = process.env.PORT || 7000;
const PORTGOOGLE = process.env.PORTGOOGLE || 7001;
const PORTSPOTIFY = process.env.PORTSPOTIFY || 7002;


const googleserver = googleapp.app.listen(PORTGOOGLE, () => {
  console.log(`Server is running on port ${PORTGOOGLE}.`);
});


const spotifyserver = spotifyapp.app.listen(PORTSPOTIFY, () => {
    console.log(`Server is running on port ${PORTSPOTIFY}.`);
  });
  

const loginserver = userloginapp.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });  

module.exports = {googleserver,spotifyserver,loginserver};