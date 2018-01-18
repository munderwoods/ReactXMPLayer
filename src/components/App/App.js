import React, { Component } from 'react';
import './style.css';
import UploadForm from './UploadForm.js';
import PlayerContainer from './../../containers/PlayerContainer.js';
import Library from './Library.js';
import upload from 'superagent';

class App extends Component {
  constructor (props) {
    super(props);
    this.setSongFromPlayer = this.setSongFromPlayer.bind(this);
    this.assignSongs = this.assignSongs.bind(this);
    this.deleteSong = this.deleteSong.bind(this);
    this.setSongFromLibrary = this.setSongFromLibrary.bind(this);
    this.setState = this.setState.bind(this);
    this.upload = this.upload.bind(this);
    this.state = {
      songs: null,
      currentSong: null,
      currentSongTitle: null,
    }
  }

  componentDidMount() {
    this.assignSongs()
  }


  upload(fileData, fileObj) {
    upload.post('/api/songs/upload')
    .attach('song', fileObj)
    .then(response => JSON.parse(response.text))
    .then(song => this.appendSong(song))
    .catch(error => console.log(error))
  }

  deleteSong(songId, songName) {
    console.log(songName);
    console.log(songId);
    fetch('http://localhost:8000/api/songs/delete/', {
      method: 'POST',
      body: JSON.stringify({"id": songId, "fileName": songName}),
      headers: {
        "Content-Type": "text/plain"
      },
    }).then(
      response => response.json()
    ).then(
      responseId => this.removeSong(responseId)
    ).catch(
      error => console.log(error),
    );
  };

  removeSong(id) {
    console.log(id);
    const songs = this.state.songs;
    const newSongs = songs.filter(song => song.id !== id);
    this.setState(
      {songs: newSongs}
    );
  }

  appendSong(song) {
    const songs = this.state.songs;
    this.setState(
      {songs: [ ...songs || [],
      song
      ]}
    );
  }

  assignSongs (songs) {
    fetch('http://localhost:8000/api/songs/songnames/')
      .then(r => r.json())
      .then(data => {
        console.log(data)
        if (data.length !== 0) {
          this.setState({songs: data, currentSong: [data[0].fileName, data[0].id], currentSongTitle: data[0].fileName})
        } else {
          this.setState({songs: null, currentSong: null, currentSongTitle: null})
        }
      })
  }

  setSongFromLibrary (songId) {
    const songObj = this.state.songs.find(i => i.id === songId);
    const newSong = [songObj.fileName, songObj.id];
    this.setState({currentSong: newSong, currentSongTitle: newSong[0]});
  }

  setSongFromPlayer(newSong) {
    this.setState({currentSong: newSong, currentSongTitle: newSong[0]});
  }

  render() {
    return (
      <div class="col s12 m2" className = "App">
          <div className="z-depth-2">
				<div style={{padding: '5%'}}>
        <h1>Play A Jam!</h1>
        <PlayerContainer currentSongTitle={this.state.currentSongTitle} currentSong={this.state.currentSong} songs={this.state.songs} setSongFromPlayer={this.setSongFromPlayer}/>
        <br />
        <Library deleteSong={this.deleteSong} setSongFromLibrary= {this.setSongFromLibrary} songs={this.state.songs}/>
        <br />
        <UploadForm upload={this.upload}/>
				</div>
        </div>
      </div>
    );
  }

}

export default App;
