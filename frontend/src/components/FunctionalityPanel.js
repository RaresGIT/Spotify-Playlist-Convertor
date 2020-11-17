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
            <>

            <label for="comboSelectPlaylists">
                Select the playlist which you want
                converted : 
                <select name="comboSelectPlaylists" 
                id="comboSelectPlaylists">
                    {this.props.comboBoxPlaylists}
                </select>

            </label>

            <p>
                Selected tracks : {this.props.selectedTracks}
            </p>

            <label for="spotifyPlaylistName">
                Desired name for your new
                Spotify playlist : 
                <input type="text" id="spotifyPlaylistName"/>
            </label>

            <button 
            className="btn btn-success"
            onClick={() => this.handleConvertClick()}
            >
                Migrate to Spotify!
                </button>

            </>
        )
    }

}

export default Panel;