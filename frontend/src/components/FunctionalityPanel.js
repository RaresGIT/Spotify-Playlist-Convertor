import React, { Component } from 'react';


class Panel extends Component
{
    constructor()
    {
        super()
    }

    handleConvertClick()
    {
        const index = document.getElementById("comboSelectPlaylists").selectedIndex;
        const playlistName = document.getElementById("spotifyPlaylistName").value;

        this.props.onMigrateClick(index,playlistName);
    }

    render(){
        return(
            <div style=
            {{textAlign:"center",
            fontFamily:"Open Sans",
            fontWeight:"700",
            display:"flex",
            flexDirection:"column",
            marginTop:"20px"
            }}>

            <label for="comboSelectPlaylists"
            style = {{color:"red"}}
            >
                Select the playlist which you want
                converted : <br/>
                <select name="comboSelectPlaylists" 
                id="comboSelectPlaylists"
                style = {{color:"red",marginTop:"5px"}}
                >
                    {this.props.comboBoxPlaylists}
                </select>


                
            </label>

            <p
            style = {{color:"red"}}
            >
                Selected tracks : {this.props.selectedTracks}
            </p>

            <label for="spotifyPlaylistName"
            style = {{color:"green"}}
            >
                Desired name for your new
                Spotify playlist : <br/>
                <input type="text" id="spotifyPlaylistName"/>
            </label>

            <button 
            className="btn btn-success"
            onClick={() => this.handleConvertClick()}
            style = {{marginLeft:"auto",marginRight:"auto"}}
            >
                Migrate to Spotify!
                </button>

            </div>
        )
    }

}

export default Panel;