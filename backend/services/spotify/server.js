let express = require('express')
let request = require('request')
let cors = require('cors')
let querystring = require('query-string') 
const bodyParser = require("body-parser")
let SpotifyApi = require('spotify-web-api-node')


let app = express()

let SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '70188bbbe3db4c088c59431261db0cd3';
let SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '5439baa2e8cd4c19aec16184f2e68f0c';
let redirect_uri = 
  process.env.REDIRECT_URI || 
  'http://localhost:8888/callback'

let spotifyApi = new SpotifyApi();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/auth', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
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
    let uri = process.env.FRONTEND_URI || 'http://localhost:3000'
    //res.send(access_token);
    res.redirect(uri + '?access_token_spotify=' + access_token)
  })
})

app.get("/spotify-user-data", function(req,res){
            
  spotifyApi.getMe()
  .then(function (data) {
    console.log(data.body.display_name,data.body.spotify);
    res.send(data);
  })
  .catch(function(error){
    console.log(error);
    res.send("failed");
  })

})

app.get("/spotify-user-playlists",function(req,res){

  spotifyApi.getUserPlaylists()
  .then(function (data) {
    let playlists = [];
    data.body.items.map((item,index) => {
      playlists[index] = {
        id : item.id,
        image : item.images[0].url,
        name : item.name,
        tracks : item.tracks.href,
        trackCount : item.tracks.total
      }
    })
    console.log(playlists);
    res.send(playlists);
  })
  .catch(function(error){
    console.log(error);
    res.send("failed");
  })

})

app.get("/spotify-search-tracks",function(req,res){
  spotifyApi.getPlaylistTracks(req.body.playlistID)
  .then(function (data){
    
    let songs = []
    data.body.items.map((song,index) =>{

      let artists = []
      song.track.artists.map((artist,index) =>{
        artists[index] = {
          name : artist.name,
          id: artist.id
        }
      })
      songs[index] = {
        artist : artists,
        name : song.track.name,
        url : song.track.external_urls.spotify

      }
      
    })

    res.send(songs);

  })
  .catch(function (error) {
    res.send(error);
  })
})

app.post("/set-spotify-token",function(req,res){

  spotifyApi.setAccessToken(req.body.token);
  console.log(req.body.token);
  res.send("success");
  

})

app.get("/search",function(req,res){
  let trackName = req.query.trackName;
  if(trackName.search(/official/i) > 0)
    trackName = trackName.substring(0,trackName.search(/official/i)-1);

  if(trackName.indexOf("(") >0)
    trackName = trackName.substring(0,trackName.indexOf("(")-1);
  console.log(trackName);

  spotifyApi.searchTracks(trackName)
  .then(function(data){
    res.send(data.body);
  }, function(err){
    res.send(err);
  })
})

let port = process.env.PORT || 8888
console.log(`Listening on port ${port}. Go / to initiate authentication flow.`)
app.listen(port)