import React, { Component } from "react";
import queryString from "query-string";
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route,Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component{
  constructor()
  {
    super();
    this.state={
      spotifyApiURI: "http://localhost:8888",
      googleApiURI: "http://localhost:8889"
    }
  }

  
  componentDidMount()
  {
    let access_token_spotify = queryString.parse(window.location.search).access_token_spotify || null;
    //let access_token_google = queryString.parse(window.location.search).access_token_google ||  null;

    

    if(access_token_spotify!= null)
    {
      axios({
        method:'post',
        url: this.state.spotifyApiURI + "/set-spotify-token",
        data:{
          token: access_token_spotify
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },

      })
      .then(response => console.log(response))
      .catch(error => console.log(error))

      window.location = 'http://localhost:3000';
    }

    axios({
      method:'get',
      url:this.state.spotifyApiURI + "/spotify-user-data",
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
    })
    .then(response => {
      
      let data = response.data.body;

      this.setState({
        country: data.country,
        name: data.display_name,
        profilepic: data.images[0].url
      })

    })
    .catch(err => console.log(err))

    axios({
      method:'get',
      url:this.state.googleApiURI + "/playlist-data",
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
    })
    .then(response => {
      
      //console.log(response);

      let playlists = []
      response.data.map((playlist,index) =>{
        playlists[index] = {
          id: playlist.id,
          title: playlist.title,
          thumbnail: playlist.thumbnail,
          videos:[]
        }
      })

      this.setState({
        playlists: playlists
      })

      //console.log(this.state);
      

    })
    .catch(err => console.log(err))

    

    


  }

  GetYoutubeTracks = (playlistId) =>{
    // axios({
    //   method:'get',
    //   url:this.state.googleApiURI + "/playlist-info?playlistId=" + playlistId ,
    //   headers: {
    //       'Access-Control-Allow-Origin': '*',
    //       'Content-Type': 'application/json',
    //     },
    // })
    // .then(response => {
    //   console.log(response);

    //   let videoCount = response.data.totalVideoCount;
      
    //   let videos = []
    //   response.data.videos.map((video,index) =>{
    //     videos[index] = {
    //       title: video.title
    //     }
    //   })
      
    //   console.log(this.state);

    //   this.updateItem(playlistId,{videos});
    //   console.log(this.state);
      
    //     })
  }

  updateItem(id, itemAttributes) {
  var index = this.state.playlists.findIndex(x=> x.id === id);
  if (index === -1)
    // handle error
    console.log(index);
  else
    this.setState({
      playlists: [
         ...this.state.playlists.slice(0,index),
         Object.assign({}, this.state.playlists[index], itemAttributes),
         ...this.state.playlists.slice(index+1)
      ]
    });
}
  render()
  {
    let profilePicture = this.state.profilepic
    ?
    this.state.profilepic
    : "Not Loaded";
    
    let greeting = this.state.name 
    ? 
    this.state.name : 'Not Logged In';

    let playlists = this.state.playlists
    ?
    this.state.playlists.map((playlist,index) =>{
    return (
      <div key={index}>
      
      <img src = {playlist.thumbnail}
       style={{maxHeight:"200px"}}
       onClick={() => this.GetYoutubeTracks(playlist.id)}
       ></img>
      
      <li> {playlist.title}</li>
      </div>)
    })
     : "Didnt load playlists"

    return (
      <Router>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-6">

              <img src={profilePicture} alt='#' id="profilepic"
              style={{maxHeight:"75%", maxWidth:"75%"}}
              ></img>
      
              <h1>{greeting}</h1>

      
              <a href="http://localhost:8888/auth">
                Login with Spotify
              </a>

              <a href="http://localhost:8889/auth">
                Login with Google
              </a>
            </div>

            <div className="col col-6">

              {playlists}
            </div>
          </div>
          

          
     
       </div>
    </Router>
  );
  }
}

export default App;
