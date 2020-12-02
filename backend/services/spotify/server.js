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
  'https://playlist-converter-spotify.herokuapp.com/callback'

let spotifyApi = new SpotifyApi();
let playlistId = "";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.get('/',function(req,res){
  res.send('Hello!');
})

app.get('/auth', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: 'user-read-private user-read-email playlist-modify-public playlist-modify-private',
      redirect_uri
    }))
})

app.get('/callback', function(req, res) {
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
})

app.get("/is-token-set",function(req,res){

  if(spotifyApi.getAccessToken() != null)
  res.send("true");
  else
  res.send("false");
})

//mandatory
app.get("/spotify-user-data", function(req,res){
            
  spotifyApi.getMe()
  .then(function (data) {
    //console.log(data.body);
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
    //console.log(playlists);
    res.send(playlists);
  })
  .catch(function(error){
    //console.log(error);
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
  //console.log(req.body.token);
  res.send("success");
  

})

app.post("/create-playlist",function(req,res){
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
  
})

app.post("/add-items", function(req,res){


  let songs = []
  //console.log(req.body);
  songs = req.body;
  //console.log(songs.length);
  //console.log(songs);
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
    //console.log(results);
    let uris = [];
    results.forEach((result) =>{
        try
        {uris.push(result.body.tracks.items[0].uri);}
       catch{
         //console.log("not found");
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

      // let promises= [];
      // for(let i=0;i<uris.length/100;i++)
      // {
      //   if((i+1)*100 < uri.length)
      //     promises.push(addItemsToPlaylist(uris.splice(i*100,(i+1)*100)));
      //   else
      //     promises.push(addItemsToPlaylist(uris.splice(i*100,uris.length)))
      // }

      // Promise.all(promises)
      // .then(results => res.send("Succes, added" + uris.length + " songs!")
      // .catch(err => res.send("Failed!"))
      // )

      res.send("Playlist too powerful!");
    }
  }) 
    //utilities
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