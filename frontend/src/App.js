import React, { Component } from "react";
import queryString from "query-string";
import './App.css';

class App extends Component{
  constructor()
  {
    super();
    this.state={
      Username:'',
      Playlists:[],
    }
  }

  componentDidMount()
  {
    let access_token_spotify = queryString.parse(window.location.search).access_token_spotify || null;
    let access_token_google = queryString.parse(window.location.search).access_token_google ||  null;

    if(access_token_google || access_token_spotify)
    window.location = 'http://localhost:3000';
    
    
    if(access_token_spotify!= null)
    {
      localStorage.setItem('spotify_token',access_token_spotify) 
    }

    if(access_token_google!=null)
    {
      localStorage.setItem('google_token',access_token_google)
    }

    let storedSpotifyToken = localStorage.getItem('spotify_token');
    let storedGoogleToken = localStorage.getItem('google_token');

    //fetch profile info
    if(storedSpotifyToken)
    {
      
     console.log("Spotify token :" + storedSpotifyToken); 

     try{
            fetch("https://api.spotify.com/v1/me",
              {headers:  {'Authorization':'Bearer ' + storedSpotifyToken}}
                  )
            .then((response) => response.json())
            .then((data) =>
              {//console.log(data);
                let display_name = data.display_name;
                let profile_picture = data.images[0].url;
              this.setState({displayName : display_name});
              this.setState({profilePicture : profile_picture});
            });

            //fetch playlist info
            fetch("https://api.spotify.com/v1/me/playlists",
            {headers:  {'Authorization':'Bearer ' + storedSpotifyToken}}
            )
            .then(response => response.json())
            .then(data => {
              //console.log(data);
              let playlists = data.items.map(item => item.name);
              this.setState({Playlists:playlists});
              
              
              
            });
        }
    catch(error)
    {
      console.log(error);
    }
    }
    
    //fetch youtube playlist info
    
    if(storedGoogleToken)
    {
      console.log("Google token : " + storedGoogleToken);

      try{
          fetch("https://youtube.googleapis.com/youtube/v3/playlists?" + 
            queryString.stringify({
              part : 'snippet',
              mine : true,
              pageToken : 'CAUQAA'
            }),
            {headers : {'Authorization' : ' Bearer '+ storedGoogleToken}})
          .then(response => response.json())
          .then(data => console.log(data));
      }
      catch(error)
      {
        console.log(error);
      }
    }

  }
  render()
  {
    let profilePicture = this.state.profilePicture
    ?
    this.state.profilePicture
    : "Not Loaded";
    
    let greeting = this.state.displayName 
    ? 
    this.state.displayName : 'Not Logged In';

    let playlistNames = this.state.Playlists
    ?
    this.state.Playlists
    : "Playlists not loaded yet";

    
    
    return (
    <div>
      <img src={profilePicture} alt='#' id="profilepic"></img>
      
      <h1>{greeting}</h1>

      <ul>
        {playlistNames.map((playlist,index) => <li key={index.toString()}>{playlist}</li>)}
      </ul>

      <button
        onClick={() => {
          window.location = "http://localhost:8888/login";
        }}
      >
        Press here to login with Spotify
      </button>

      <button
        onClick={() => window.location = "http://localhost:8889/auth"}
      >
        Press here to login with Google
      </button>
    </div>
  );
  }
}

export default App;
