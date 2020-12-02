import React, { Component } from 'react';
import FunctionalityPanel from './FunctionalityPanel';

class ColRight extends Component{

    constructor()
    {
        super()
    }

    componentDidMount()
    {

    }

    onMigrateClick(index,playlistName)
    {
        this.props.onMigrateClick(index,playlistName);
    }

    render()
    {
        const colContainerStyle={
            width:"100%",
            minHeight:"250px",
            height:"calc(100vh * 0.3)",
            backgroundColor:"white",
            border : "2px solid black"
        }

        const notLoggedInStyle={
            lineHeight:"normal",
            fontSize:"20px",
            fontWeight:"500",
            textAlign:"center",
            marginTop:"25%",
        }

        const content = this.props.isAuth
        ?
        <FunctionalityPanel
        comboBoxPlaylists={this.props.comboBoxPlaylists}
        selectedTracks="0"
        onMigrateClick={(index,playlistName) => this.onMigrateClick(index,playlistName)}
        />
        :
        <div >
            <p style={notLoggedInStyle}>
                    Welcome to $(Brand)
              <br/> Login with Spotify and Google
              <br/> to use features </p>
            </div>

        return(

            <div style = {colContainerStyle}>
            {content}
            </div>
            
        )
        
    }

}

export default ColRight;