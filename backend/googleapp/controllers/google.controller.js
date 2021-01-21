const { user } = require("../models");

let {google} = require('googleapis')
let queryString = require('query-string')

let authClient = new google.auth.OAuth2(
  '351958591751-3rlg46hcqh3soiasec3kj6n33m0m1h6r.apps.googleusercontent.com',
  'B1K_CXLwGd5YCrRNDrJSgm8S',
  'http://localhost:8889/callback'
)


exports.authenticate = (req,res) => {
    const url = authClient.generateAuthUrl(
      {
        access_type: 'offline',
        scope:'https://www.googleapis.com/auth/youtube.readonly'
      }
    )
    res.redirect(url);
  }
  
  exports.callback =  async (req,res) => {
    let code = req.query.code || null; 
    const {tokens} = await authClient.getToken(code);
    //console.log(tokens, code);
  
    authClient.setCredentials(tokens);
    isAccessTokenSet = true;
    let redirect_uri = process.env.redirect_uri || 'http://localhost:3000';
    //'https://playlist-converter-frontend.herokuapp.com/'
    access_token = tokens.access_token;
    console.log(access_token);
    res.redirect(redirect_uri + "?setGoogleToken=true");
  }
  
  exports.getAllPlaylists = (req,res) => {
    let allPlaylists=[];
    let pageToken="";
  
    async function getallPlaylists(allPlaylists,pageToken,auth)
        {
          //console.log(allPlaylists);
          //console.log("called");
          return new Promise((resolve,reject) =>{
              var service = google.youtube('v3');
                service.playlists.list({
                  auth:auth,
                  part : 'snippet,contentDetails',
                  mine : 'true',
                  pageToken: pageToken
                },function(err,response){
                  if(err)
                  console.log(err);
  
                  let playlists = [];
  
                  //console.log(response);
                  response.data.items.map((playlist,index) =>{
                    playlists[index] = {
                        id: playlist.id,
                        title: playlist.snippet.title,
                        thumbnail: playlist.snippet.thumbnails.medium.url
  
                           }
                  })
                  
                  Array.prototype.push.apply(allPlaylists,playlists);
                  //console.log("This call: " + videos);
                  //console.log("All:" + allPlaylists)
                  //console.log(allPlaylists);
                  if(response.data.nextPageToken){
                    getallPlaylists(allPlaylists,response.data.nextPageToken,auth)
                    .then((resallPlaylists) => resolve(resallPlaylists))
                  }
                  else{
                    resolve(allPlaylists);
                  }
  
          })
          })
            
        }
  
  
    getallPlaylists(allPlaylists,pageToken,authClient)
    .then(function(sendResponse){
      console.log(allPlaylists);
      res.send(allPlaylists);
    })
  }
  
  exports.getAllPlaylistVideos = (req,res) => {
    
    let allVideos=[];
    let pageToken="";
    let playlistId;
  
    async function getAllVideos(playlistId,allVideos,pageToken,auth)
        {
          //console.log(allVideos);
          //console.log("called");
          return new Promise((resolve,reject) =>{
              var service = google.youtube('v3');
                service.playlistItems.list({
                  auth:auth,
                  part: 'snippet,id',
                  playlistId: playlistId,
                  pageToken: pageToken
                },function(err,response){
                  if(err)
                  console.log(err);
  
                  let videos = [];
  
                  //console.log(response);
                  response.data.items.map((video,index) =>{
                    videos[index] = {
                      title : video.snippet.title
                    }
                  })
                  
                  Array.prototype.push.apply(allVideos,videos);
                  //console.log("This call: " + videos);
                  //console.log("All:" + allVideos)
                  //console.log(allVideos);
                  if(response.data.nextPageToken){
                    getAllVideos(playlistId,allVideos,response.data.nextPageToken,auth)
                    .then((resAllVideos) => resolve(resAllVideos))
                  }
                  else{
                    resolve(allVideos);
                  }
  
          })
          })
            
        }
  
    
    if(req.query.playlistId != null)
    playlistId = req.query.playlistId
    else
    res.send("did not receive playlistId query");
  
    getAllVideos(playlistId,allVideos,pageToken,authClient)
    .then(function(sendResponse){
      console.log(allVideos);
      res.send(allVideos);
    })
  }