let express = require('express')
let queryString = require('query-string')
let fetch = require('node-fetch')
let cors = require('cors')
let bodyParser = require('body-parser')

let {google} = require('googleapis');
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport');
let authClient = new google.auth.OAuth2(
  '351958591751-3rlg46hcqh3soiasec3kj6n33m0m1h6r.apps.googleusercontent.com',
  'B1K_CXLwGd5YCrRNDrJSgm8S',
  'http://localhost:8889/callback'
)

let app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.get('/auth',function(req,res)
{
  const url = authClient.generateAuthUrl(
    {
      access_type: 'offline',
      scope:'https://www.googleapis.com/auth/youtube.readonly'
    }
  )
  res.redirect(url);

})

app.get('/callback', async function(req,res)
{
  let code = req.query.code || null; 
  const {tokens} = await authClient.getToken(code);

  authClient.setCredentials(tokens);
  let redirect_uri = process.env.redirect_uri || 'http://localhost:3000/';
  res.redirect(redirect_uri);

  
  //res.send(tokens);
})

authClient.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    authClient.setCredentials({
      refresh_token : tokens.refresh_token
    })
    //console.log(tokens.refresh_token);
  }
  //console.log(tokens.access_token);
});

let nextPageToken = "";
app.get("/playlist-data", function(req,res){
   
  
  var service = google.youtube('v3');
  service.playlists.list({
    auth : authClient,
    part : 'snippet,contentDetails',
    mine : 'true',
  }, function(err,response){
    if(err){
      console.log(err);
      return;
    }
    

    if(response.data.nextPageToken)
    nextPageToken = response.data.nextPageToken

    //console.log(nextPageToken);

    let playlists = [];
    response.data.items.map((playlist,index) => {
      playlists[index] = {
        id: playlist.id,
        title: playlist.snippet.title,
        thumbnail: playlist.snippet.thumbnails.maxres.url

      }
    })

    res.send(playlists);

  }
  )

})

app.get("/playlist-data/next", function(req,res){
   
  
  var service = google.youtube('v3');
  service.playlists.list({
    auth : authClient,
    part : 'snippet,contentDetails',
    mine : 'true',
    pageToken: nextPageToken
  }, function(err,response){
    if(err){
      console.log(err);
      return;
    }
    

    if(response.data.pageToken)
    nextPageToken = response.data.nextPageToken

    //console.log(nextPageToken);

    let playlists = [];
    response.data.items.map((playlist,index) => {
      playlists[index] = {
        id: playlist.id,
        title: playlist.snippet.title,
        thumbnail: playlist.snippet.thumbnails.maxres.url

      }
    })

    res.send(playlists);

  }
  )

})
let nextPageTokenVideos = "";

let allVideos=[]
function getAllVideos(playlistId,allVideos,pageToken)
{
  return new Promise((resolve,reject) =>{
      var service = google.youtube('v3');
        service.playlistItems.list({
          auth:authClient,
          part: 'snippet,id',
          playlistId: playlistId,
          pageToken: pageToken
        },function(err,response){
          if(err)
          console.log(err);

          let videos = [];

          response.data.items.map((video,index) =>{
            videos[index] = {
              title : video.snippet.title
            }
          })

          allVideos.concat(videos);

          if(response.data.nextPageToken){
            getAllVideos(playlistId,allVideos,response.data.nextPageToken)
            .then((resAllVideos) => resolve(resAllVideos))
          }

  })
  })

 
  

}

app.get("/playlist-videos",function(req,res){


  var service = google.youtube('v3');
  service.playlistItems.list({
    auth: authClient,
    part:'snippet,id',
    playlistId: req.query.playlistId
  }, function(err,response){
    if(err)
    console.log(err);

    if(response.data.nextPageToken)
    nextPageTokenVideos = response.data.nextPageToken;


    let videos = [];

    response.data.items.map((video,index) =>{
      videos[index] = {
        title : video.snippet.title
      }
    })
    res.send({
      videos: videos,
      totalVideoCount: response.data.pageInfo.totalResults
    });
  })

})

app.get("/playlist-info/next",function(req,res){


  var service = google.youtube('v3');
  service.playlistItems.list({
    auth: authClient,
    part:'snippet,id',
    playlistId: req.query.playlistId,
    pageToken: nextPageTokenVideos
  }, function(err,response){
    if(err)
    console.log(err);

    if(response.data.nextPageToken)
    nextPageTokenVideos = response.data.nextPageToken;

    let videos = [];

    response.data.items.map((video,index) =>{
      videos[index] = {
        title : video.snippet.title,
        channelId: video.snippet.channelId

      }
    })
    res.send(videos);
  })

})


let port = process.env.PORT || 8889
console.log(`Listening on port ${port}. Go /login to initiate authentication flow.`)
app.listen(port)