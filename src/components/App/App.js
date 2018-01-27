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
      playing: false,
      songs: null,
      currentSong: null,
      currentSongTitle: null,
    }
  }

  componentDidMount() {
    this.assignSongs()
  }


  upload(fileObj) {
    upload.post('/api/songs/upload')
    .attach('song', fileObj)
    .then(response => JSON.parse(response.text))
    .then(song => this.appendSong(song))
    .catch(error => console.log(error))
  }

  deleteSong(songId, songName) {
    fetch('/api/songs/delete/', {
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
    fetch('/api/songs/songnames/')
      .then(r => r.json())
      .then(data => {
        if (data.length !== 0) {
          this.setState({songs: data, currentSong: [data[0].fileName, data[0].id], currentSongTitle: data[0].fileName})
        } else {
          this.setState({songs: null, currentSong: null, currentSongTitle: null})
        }
      })
  }

  setSongFromLibrary (songId) {
    const songObj = this.state.songs.find(i => i.id === songId);
    this.setState({currentSong: [songObj.fileName, songObj.id], currentSongTitle: songObj.fileName});
  }

  setSongFromPlayer(newSong) {
    this.setState({currentSong: newSong, currentSongTitle: newSong[0]});
  }

  render() {
    return (
      <div className = "App">
        <div className="z-depth-2">
			   	<div className="col s12 m2" style={{padding: '5%'}}>
           <h1>Play A Jam!</h1>
           <PlayerContainer currentSongTitle={this.state.currentSongTitle} currentSong={this.state.currentSong} songs={this.state.songs} setSongFromPlayer={this.setSongFromPlayer}/>
           <br />
           <Library deleteSong={this.deleteSong} setSongFromLibrary= {this.setSongFromLibrary} songs={this.state.songs}/>
           <br />
           <UploadForm upload={this.upload}/>
           <br />
           <h5>This is an XM player built by Matthew S Underwood. XM files are used by the chiptune sequencer Fasttracker 2, or its modern equivalent, MilkyTracker. They are binary files and as such are extremely small and are well suited to sountracking videogames. The songs are supposed to loop infinitely and as such this application doesn't function quite as you'd expect from a more standard music player. I'm going to include some permanent links to my AWS s3 bucket below that will allow you to download sample XM files that I made. This way you can test uploading and deleting them.</h5>
            <a href="https://s3-us-west-1.amazonaws.com/reactxmplayer/Kowloon.xm">Kowloon</a>
            <br />
            <a href="https://s3-us-west-1.amazonaws.com/reactxmplayer/Ruins.xm">Ruins</a>
            <br />
            <a href="https://s3-us-west-1.amazonaws.com/reactxmplayer/Surface.xm">Surface</a>
            <br />
            <a href="https://s3-us-west-1.amazonaws.com/reactxmplayer/The+Chamber.xm">The Chamber</a>
				  </div>
        </div>
      </div>
    );
  }

}

export default App;
