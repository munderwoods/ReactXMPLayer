import React, { Component } from 'react';
import SongHeading from './../SongHeading.js';
import Modplayer from './../ft2/player.js';
import Player from './../Player.js';

  let XMPlayer = new Modplayer();
class PlayerContainer extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.state = {
      currentSong: this.props.songs[0]
    };
  };

  previous = function () {
    const index = this.props.songs.findIndex(i => i === this.state.currentSong);
    if (index === 0) {
      this.setState({currentSong: this.props.songs[this.props.songs.length - 1]});
    } else {
        this.setState({currentSong: this.props.songs[index - 1]});
    };
  }

  next = function () {
    XMPlayer.autostart = true;
    XMPlayer.load('http://localhost:3000/src/songs/Ota.xm')
    console.log(XMPlayer);
    const index = this.props.songs.findIndex(i => i === this.state.currentSong);
    if (index === this.props.songs.length - 1) {
      this.setState({currentSong: this.props.songs[0]});
    } else {
        this.setState({currentSong: this.props.songs[index + 1]});
    };
  };

  render() {
    return (
      <div>
        <SongHeading title={this.state.currentSong} />
        <Player currentSong={this.state.currentSong} next={this.next} previous={this.previous} />
      </div>
    );
  }

}

export default PlayerContainer;

