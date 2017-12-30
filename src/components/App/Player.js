import React, { Component } from 'react';
import Button from './Button.js';

class Player extends Component {
  render () {
    const currentSong = this.props.currentSong;
		return (
			<div>
				<Button onClick ={() => this.props.previous()} id="previous"label='Previous'/>
				<Button onClick ={() => alert('Play ' + currentSong)} id="play" label='Play'/>
				<Button onClick ={() => alert('Stop')} id="stop"label='Stop'/>
				<Button onClick ={() => this.props.next()} id="next"label='Next'/>
			</div>
		);
  }

}


export default Player;

