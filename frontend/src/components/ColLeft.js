import React, { Component } from 'react';


const styleLoginButtons={
    width:"100%",
    maxWidth:"300px",
    marginTop:"30px",
    marginLeft:"auto",
    marginRight:"auto",
    fontSize:"18px"
}

const styleLogoBanner = {
    marginTop:"15px",
    width:"100%",
    minWidth:"200px",
    maxWidth:"300px",
    marginLeft:"auto",
    marginRight:"auto"
}

class ColLeft extends Component{

    constructor()
    {
        super()
    }

    componentDidMount()
    {
        //console.log(this.props.isAuthWithSpotify);
    }

    componentDidUpdate()
    {
        // if(this.props.isAuthWithSpotify != prevProps.isAuthWithSpotify)
        // console.log("changed auth");
    }

    
    handleSpotifyLogin = () =>{
        this.props.onSpotifyLogin();
        //console.log(this.props.isAuthWithSpotify);
    }

    handleGoogleLogin = () =>{
        this.props.onGoogleLogin();
    }

    render()
    { 
        const spotifyLoginButton = this.props.isAuthWithSpotify
        ?
        "Logged In"
        :
        <button 
        className="btn btn-success"
        style={styleLoginButtons}
        onClick={() => this.handleSpotifyLogin()}
        >Login with Spotify</button>
        
        

        
        return(
            <>
        <img 
        src="https://via.placeholder.com/400x100?text=Logo"
        style={styleLogoBanner}
        ></img>

        {spotifyLoginButton}
        
        
        <button
        className="btn btn-danger"
        style={styleLoginButtons}
        onClick={() => this.handleGoogleLogin()}
        >Login with Google</button>
        </>
              
              )
    }

}

export default ColLeft;