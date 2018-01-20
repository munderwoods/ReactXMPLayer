import React from 'react';
import Button from './Button.js';

function Player(props) {
  return (
    <div>
      <Button onClick ={() => props.previous()} id="previous" icon="skip_previous" label='Previous'/>
      <Button onClick ={() => props.play()} id="play" icon="play_arrow" label='Play'/>
      <Button onClick ={() => props.stop()} id="stop" icon="stop" label='Stop'/>
      <Button onClick ={() => props.next()} id="next" icon="skip_next" label='Next'/>
    </div>
  );
}



export default Player;

