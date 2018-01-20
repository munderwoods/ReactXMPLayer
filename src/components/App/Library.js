import React, { Component } from 'react';
import ListItem from './ListItem.js';


class Library extends Component {

  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this);
    this.deleteClick = this.deleteClick.bind(this);
  }

  deleteClick(event, songId, songName) {
    this.props.deleteSong(songId, songName);
  }

  clicked(event, songId) {
    event.preventDefault();
    this.props.setSongFromLibrary(songId);
  }

	render () {
		return (
			<div>
        <h4>Pick A Song From The Library</h4>
        <ul
          className="collection"
          style={{listStyle: 'none'}}>
            {this.props.songs ? this.props.songs.map((song) =>
              <ListItem
                key={song.id}
                song={song}
                clicked={this.clicked}
                deleteClick={this.deleteClick}
              />
            ) : null}
        </ul>
			</div>
		);
	};

}

export default Library;

