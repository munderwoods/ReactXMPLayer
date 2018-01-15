import React, { Component } from 'react';
import SongHeading from './../components/App/SongHeading.js';
import Modplayer from './../components/App/ft2/player.js';
import Player from './../components/App/Player.js';

let XMPlayer = new Modplayer();
class PlayerContainer extends Component {
  constructor(props) {
    super(props);
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  };

  play() {
    XMPlayer.autostart = true;
    XMPlayer.load('http://localhost:3000/songs/Ota.xm');
  }

  stop() {
    XMPlayer.stop();
  }

  previous() {
    const index = this.props.songs.findIndex(i => i.id === this.props.currentSong[1]);
    if (index === 0) {
      let newSong = this.props.songs[this.props.songs.length - 1];
      this.props.setSongFromPlayer([newSong.fileName, newSong.id]);
    } else {
      let newSong = this.props.songs[index - 1];
      this.props.setSongFromPlayer([newSong.fileName, newSong.id]);
    };
  }

  next() {
    const index = this.props.songs.findIndex(i => i.id === this.props.currentSong[1]);
    if (index === this.props.songs.length - 1) {
      let newSong = this.props.songs[0];
      this.props.setSongFromPlayer([newSong.fileName, newSong.id]);
    } else {
      let newSong = this.props.songs[index + 1];
      this.props.setSongFromPlayer([newSong.fileName, newSong.id]);
    };
  };

  render() {
    return (
      <div>
        <SongHeading title={this.props.currentSongTitle} />
        <Player currentSong={this.props.currentSong} play={this.play} stop={this.stop} next={this.next} previous={this.previous} />
      </div>
    );
  }

}

export default PlayerContainer;

