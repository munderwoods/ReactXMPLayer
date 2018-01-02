import React, { Component } from 'react';
import Button from './Button.js';

class Player extends Component {
  render () {
		return (
			<div>
				<Button onClick ={() => this.props.previous()} id="previous" icon="skip_previous" label='Previous'/>
				<Button onClick ={() => this.props.play()} id="play" icon="play_arrow" label='Play'/>
				<Button onClick ={() => this.props.stop()} id="stop" icon="stop" label='Stop'/>
				<Button onClick ={() => this.props.next()} id="next" icon="skip_next" label='Next'/>
			</div>
		);
  }

}


export default Player;

