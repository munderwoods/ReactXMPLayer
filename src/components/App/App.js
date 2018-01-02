import React, { Component } from 'react';
import './style.css';
import UploadForm from './UploadForm.js';
import PlayerContainer from './../../containers/PlayerContainer.js';
import Library from './Library.js';

const songs = ["song1.xm", "song2.xm", "song3.xm"];
let currentSong = songs[0];

class App extends Component {
  constructor (props) {
    super(props);
    this.setSongFromPlayer = this.setSongFromPlayer.bind(this);
    this.setSongFromLibrary = this.setSongFromLibrary.bind(this);
    this.state = {
      currentSong: currentSong,
      songs: songs,
    }
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
          <p class="z-depth-2">
				<div style={{padding: '5%'}}>
        <h1>Play A Jam!</h1>
        <PlayerContainer currentSong={this.state.currentSong} songs={this.state.songs} setSongFromPlayer={this.setSongFromPlayer}/>
        <Library setSongFromLibrary= {this.setSongFromLibrary} songs={this.state.songs}/>
        <UploadForm />
				</div>
        </p>
      </div>
    );
  }

}

export default App;
