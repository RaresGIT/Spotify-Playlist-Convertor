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
        const placeHolderStyle={
            width:"100%",
            height:"calc(100vw * 0.2)",
            minHeight:"250px",
            marginTop:"25vw",
            backgroundColor:"white"
        }

        const textStyle={
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
        <div style={placeHolderStyle}>
            <p style={textStyle}>
                    Welcome to $(Brand)
              <br/> Login with Spotify and Google
              <br/> to use features </p>
            </div>

        return(

            <>
            {content}
            </>
            
        )
        
    }

}

export default ColRight;