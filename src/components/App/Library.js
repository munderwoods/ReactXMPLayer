import React, { Component } from 'react';
import ListItem from './ListItem.js';


class Library extends Component {

  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
  }

  deleteClick(event, songId) {
    this.props.deleteSong(songId);
  }

  clicked(event) {
    event.preventDefault();
    let newSong = event.target.textContent;
    this.props.setSongFromLibrary(newSong);
  }

	render () {
		return (
			<div>
        <h4>Pick A Song From The Library</h4>
        <ul
          class="collection"
          style={{listStyle: 'none'}}>
            {this.props.songs ? this.props.songs.map((song) => <ListItem song={song} clicked={this.clicked} deleteClick={this.deleteClick} />) : null}
          </ul>
			</div>
		);
	};

}

export default Library;

