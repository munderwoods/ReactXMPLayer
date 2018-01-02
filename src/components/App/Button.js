import React, { Component } from 'react';

class Button extends Component {
  render() {
    return (
			<button class="waves-effect waves-light btn" onClick={this.props.onClick}><i class="material-icons left">{this.props.icon}</i>{this.props.label}</button>
    );
  }
}

export default Button;

