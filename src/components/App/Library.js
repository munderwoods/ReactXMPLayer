import React, { Component } from 'react';



class Library extends Component {


  listItems = this.props.songs.map((song) =>
    <li style={{flex: 1, flexDirection: 'row'}} key={song}>
			<a class="collection-item"
				href="/songListItem/"
				onClick={this.clicked.bind(this)}
				>{song}
			</a>
			<button
				style={{
					float: 'right'}}
				class="waves-effect waves-lite btn">
					<i class="material-icons center">delete_forever</i>
			</button>
		</li>
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
        <ul class="collection" style={{listStyle: 'none'}}>{this.listItems}</ul>
			</div>
		);
	};
}

export default Library;

