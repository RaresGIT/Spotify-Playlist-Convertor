import React, { Component } from "react";
import queryString from "query-string";
import axios from 'axios';
import ColumnLeft from './components/ColLeft';
import ColumnRight from './components/ColRight';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component{
  constructor()
  {
    super();
    this.state={
      spotifyApiURI: "https://playlist-converter-spotify.herokuapp.com",
      googleApiURI: "http://localhost:8889",
      defaultURI: "http://localhost:3000"
    }
  }

  
  componentDidMount()
  {
    this.checkAuth()
    
  }

  GetYoutubeTracks = (playlistId) =>{

    return new Promise((resolve) =>{
      resolve(

        axios({
      method:'get',
      url:this.state.googleApiURI + "/all-playlist-videos?playlistId=" + playlistId ,
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        console.log(response.data);
        
        let videos = [];
        response.data.map((video,index) =>{
          videos[index] = {
            title: video.title
          }
        })
        return videos;
        })
      .then(videos => {
        this.updateItem(playlistId,{videos});
      })
      
      )
  })
}

  updateItem(id, itemAttributes) {
  var index = this.state.youtubePlaylists.findIndex(x=> x.id === id);
  if (index === -1)
    // handle error
    console.log(index);
  else
    this.setState({
      youtubePlaylists: [
         ...this.state.youtubePlaylists.slice(0,index),
         Object.assign({}, this.state.youtubePlaylists[index], itemAttributes),
         ...this.state.youtubePlaylists.slice(index+1)
      ]
    });
}

  createSpotifyPlaylist(textBoxID){
    const name = document.getElementById(textBoxID).value;
    console.log(name);


    return new Promise((resolve) => {
      resolve(
              axios({
                method:'post',
                url:this.state.spotifyApiURI + "/create-playlist?playlistName=" + name,
                headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
              })
              .then(response => {
                console.log(response);
              })
              .catch(err => console.log(err))
      )
    })
    
  }

  addItemsToSpotify(comboBoxID){
    const index = document.getElementById(comboBoxID).selectedIndex;
    console.log(index);
    return new Promise((resolve) =>{

      resolve(

            this.GetYoutubeTracks(this.state.youtubePlaylists[index].id)
            .then(placeholder => {

              axios({
              method:'post',
              url:this.state.spotifyApiURI + "/add-items",
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json',
                },
              data:this.state.youtubePlaylists[index].videos
            })
            .then(response => {
              console.log(response);
            })
            .catch(err => console.log(err))



            })

            

      )

    })
    
  }


  getSpotifyUserData()
  {
    return new Promise((resolve) => {
      resolve(
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
        .catch(err => console.log(err)))
    })
        
    
  }

  getYoutubePlaylists()
  {
      return new Promise((resolve) => {

        resolve(
          axios({
      method:'get',
      url:this.state.googleApiURI + "/all-playlists",
      headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        })
      .then(response => {
      
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
          youtubePlaylists: playlists
          })
        })
      .catch(err => console.log(err))

        )

      })
      
  }

  checkAuth()
  {
    
      axios({
          method:'get',
          url:this.state.spotifyApiURI + "/is-token-set",
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
          })
        .then(response => {
      
          console.log(response.data);
          if(response.data === true)
          this.setState({
            authSpotify:true
          })

            })
              
            
    axios({
          method:'get',
          url:this.state.googleApiURI + "/is-token-set",
          headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Content-Type': 'application/json',
                    },
          })
          .then(response => {
                  
                  console.log(response.data);
                  if(response.data === true)
                  this.setState({
                    authGoogle:true
                  })

                  })
          .then(placeholder =>{
            let promises = []
            if(this.state.authSpotify === true)
            promises.push(this.getSpotifyUserData())

            if(this.state.authGoogle === true)
            promises.push(this.getYoutubePlaylists())

            Promise.all(promises)
            .then(placeholder => console.log(this.state))

          })
                   
  }

  onMigrateClick = () =>{
       //console.log(index,playlistName);

      //  this.setState({
      //    selectedYoutubePlaylistIndex : index,
      //    desiredSpotifyPlaylistName : playlistName
      //  })

      let promises =[]

      const CreatePlaylistPromise = this.createSpotifyPlaylist("spotifyPlaylistName");
      promises.push(CreatePlaylistPromise);
      const AddItemsToPlaylistPromise = this.addItemsToSpotify("comboSelectPlaylists");
      promises.push(AddItemsToPlaylistPromise);

      Promise.all(promises)
      .then(placeholder => console.log("Created and added items to playlist"));


      
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

     let comboBoxPlaylists = this.state.youtubePlaylists
     ?
     this.state.youtubePlaylists.map((playlist,index) =>{
       return (
         <option value={playlist.title} key={index}>
           {playlist.title}
         </option>
       )
     })
     : <option>
       Didn't load any playlists!
     </option>

     const styleColLeft = {
       
       display:"flex",
       flexDirection:"column",
       marginTop:"30%",
      
     }

     const styleColRight = {
       
       marginTop:"30%"
     }

     let isAuthWithSpotify = false;

     const onSpotifyLogin = () =>{
       //console.log(isAuthWithSpotify);
       //isAuthWithSpotify=true;


       //Auth Spotify Service
      window.location = this.state.spotifyApiURI + "/auth";


     }

     const onGoogleLogin = () =>{
       console.log("yay");

       //Auth Google Service
       window.location = this.state.googleApiURI + "/auth";
     }

     
    return (
      
        <div className="container">
          <div className="row justify-content-lg-center">
            <div className="col-12 col-md-7" style={styleColLeft}>

              <ColumnLeft
              onSpotifyLogin={onSpotifyLogin}
              onGoogleLogin={onGoogleLogin}
              isAuthWithSpotify={isAuthWithSpotify}

              />

            </div>
            <div className="col-12 col-md-5" style={styleColRight}>

              <ColumnRight
              isAuth={true}
              comboBoxPlaylists={comboBoxPlaylists}
              onMigrateClick={() => this.onMigrateClick()}
              />
            </div>
          </div>
          

       </div>

      
  );
  }
}

export default App;
