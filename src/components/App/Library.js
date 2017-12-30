import React, { Component } from 'react';


class Library extends Component {
	render () {
		return (
			<div>
        <h2>Pick A Song From The Library</h2>
        <ul style={{listStyle: 'none'}}>
          {this.props.songs.map((song) => <li>{song}</li>)}
        </ul>
			</div>
		);
	};
}
export default Library;

