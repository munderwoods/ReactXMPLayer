import React, { Component } from 'react';



class Library extends Component {


  listItems = this.props.songs.map((song) =>
    <li key={song}><a href="/songListItem/"  onClick={this.clicked.bind(this)} >{song}</a></li>
  );

  clicked(event) {
    event.preventDefault();
    let newSong = event.target.textContent;
    this.props.setSongFromLibrary(newSong);
  }

	render () {
		return (
			<div>
        <h2>Pick A Song From The Library</h2>
        <ul style={{listStyle: 'none'}}>{this.listItems}</ul>
			</div>
		);
	};
}

export default Library;

