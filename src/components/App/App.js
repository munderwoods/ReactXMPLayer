import React, { Component } from 'react';
import './style.css';
import UploadForm from './UploadForm.js';
import PlayerContainer from './../../containers/PlayerContainer.js';
import Library from './Library.js';

const songs = ["song1.xm", "song2.xm", "song3.xm"];

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      songs: songs,
    }
  }

  render() {
    return (
      <div className = "App">
        <h1>Play A Jam!</h1>
        <PlayerContainer songs={this.state.songs}/>
        <Library songs={this.state.songs}/>
        <UploadForm />
      </div>
    );
  }

}

export default App;
