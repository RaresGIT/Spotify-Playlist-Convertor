const { user } = require("../models");
let SpotifyApi = require('spotify-web-api-node');
let querystring = require('query-string');

let SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '70188bbbe3db4c088c59431261db0cd3';
let SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '5439baa2e8cd4c19aec16184f2e68f0c';
let redirect_uri = 
  process.env.REDIRECT_URI || 
  'https://playlist-converter-spotify.herokuapp.com/callback'

let spotifyApi = new SpotifyApi();

exports.authenticate = (req,res) => {

    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private',
      redirect_uri
    }))

}

exports.callback = (req,res) => {
    try{
        let code = req.query.code || null
        let authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
            code: code,
            redirect_uri,
            grant_type: 'authorization_code'
          },
          headers: {
            'Authorization': 'Basic ' + (new Buffer(
              SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET
            ).toString('base64'))
          },
          json: true
        }
        request.post(authOptions, function(error, response, body) {
          var access_token = body.access_token
          let uri = process.env.FRONTEND_URI || 'https://playlist-converter-frontend.herokuapp.com/'
          //res.send(access_token);
      
          spotifyApi.setAccessToken(access_token);
          res.redirect(uri + "?setSpotifyToken=true");
        })
        }
        catch{
          console.log("failed auth");
        }
}

exports.retrieveUserData = (req,res) => {
    spotifyApi.getMe()
  .then(function (data) {
    //console.log(data.body);
    res.send(data);
  })
  .catch(function(error){
    console.log(error);
    res.send("failed");
  })
}

exports.createSpotifyPlaylist = (req,res) => {
    let playlistName = "";
  if(req.query.playlistName != null)
   playlistName = req.query.playlistName
  else
  res.send("didnt receive playlist name")

  spotifyApi.createPlaylist(playlistName,{'description' : 'This playlists was generated using an online service' , 'public' : true })
  .then(function(data){
    playlistId = data.body.id;
    //res.send("created playlist");
    res.send("Created " + playlistName + "with id : " + playlistId);
  })
  .catch(function(error){
    console.log(error);
  })
}

exports.addItemsToPlaylist = (req,res) => {

    function searchTrack(track){
        return new Promise((resolve,reject) => {
          resolve(spotifyApi.searchTracks(track,{limit:1}));
        })
      }
    
      function addItemsToPlaylist(uris){
        return new Promise((resolve) => {
          resolve(spotifyApi.addTracksToPlaylist(playlistID,uris));
        })
      }

  let songs = [];
  
  songs = req.body;
  
  let trimmednames = [];

  for(let i=0;i<songs.length;i++)
  {
      let trackName = songs[i].title;

      if(trackName.search(/official/i) > 0)
        trackName = trackName.substring(0,trackName.search(/official/i)-1);

      if(trackName.indexOf("(") >0)
        trackName = trackName.substring(0,trackName.indexOf("(")-1);

      trimmednames.push(trackName);

  }


  let promises = []

  for(let i=0;i<trimmednames.length;i++)
  {
    let promise = searchTrack(trimmednames[i]);
    promises.push(promise);
  }

  
  Promise.all(promises)
  .then(results =>{
    
    let uris = [];
    results.forEach((result) =>{
        try
        {uris.push(result.body.tracks.items[0].uri);}
       catch{
         
       }
    })
    return uris;
  })
  .then(uris => {
    
    if(uris.length < 100)
    {
    addItemsToPlaylist(playlistID,uris)
    .then(data => {res.send("Succes, added" + uris.length + " songs!")})
    .catch(err => {res.send("Failed!")})
    }
    else{
      res.send("Playlist too powerful!");
    }
})
}


