import React, { Component } from 'react';
import Button from './Button.js';

class Player extends Component {
  render () {
		return (
			<div>
				<Button onClick ={() => this.props.previous()} id="previous"label='Previous'/>
				<Button onClick ={() => this.props.play()} id="play" label='Play'/>
				<Button onClick ={() => this.props.stop()} id="stop"label='Stop'/>
				<Button onClick ={() => this.props.next()} id="next"label='Next'/>
			</div>
		);
  }

}


export default Player;

