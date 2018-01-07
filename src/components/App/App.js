import React, { Component } from 'react';
import './style.css';
import UploadForm from './UploadForm.js';
import PlayerContainer from './../../containers/PlayerContainer.js';
import Library from './Library.js';

class App extends Component {
  constructor (props) {
    super(props);
    this.assignSongs();
    this.setSongFromPlayer = this.setSongFromPlayer.bind(this);
    this.setSongFromLibrary = this.setSongFromLibrary.bind(this);
    this.setState = this.setState.bind(this);
    this.state = {
      songs: this.assignSongs(),
      currentSong: "song"
    }
  }

  async assignSongs (songs) {
    fetch('http://localhost:8000/api/songs/songnames/').then(
      function (response) {
        response.json().then(function(data) {
          return data;
        });
      }
    )
  }

  setSongFromLibrary (newSong) {
    this.setState({currentSong: newSong});
    console.log(this.state);
  }

  setSongFromPlayer(newSong) {
    this.setState({currentSong: newSong});
    console.log(this.state.currentSong);
  }

  render() {
    return (
      <div class="col s12 m2" className = "App">
          <div class="z-depth-2">
				<div style={{padding: '5%'}}>
        <h1>Play A Jam!</h1>
        <PlayerContainer currentSong={this.state.currentSong} songs={this.state.songs} setSongFromPlayer={this.setSongFromPlayer}/>
        <br />
        <Library setSongFromLibrary= {this.setSongFromLibrary} songs={this.state.songs}/>
        <br />
        <UploadForm />
				</div>
        </div>
      </div>
    );
  }

}

export default App;
