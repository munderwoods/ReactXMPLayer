import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
			<button style={{margin: '5px'}}className="waves-effect waves-light btn" onClick={this.props.onClick}><i className="material-icons left">{this.props.icon}</i>{this.props.label}</button>
    );
  }
}

export default Button;

