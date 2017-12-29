import React, { Component } from 'react';

class SongHeading extends Component {
  render() {
    return (
      <h3>Now Playing {this.props.title}</h3>
    );
  }
}

export default SongHeading;

