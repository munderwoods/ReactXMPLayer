import React from 'react';

function Button(props) {
  return (
    <button style={{margin: '5px'}}className="waves-effect waves-light btn" onClick={props.onClick}><i className="material-icons left">{props.icon}</i>{props.label}</button>
  );
}

export default Button;

