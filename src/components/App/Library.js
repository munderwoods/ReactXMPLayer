import React, { Component } from 'react';



class Library extends Component {

  listItems = this.props.songs.map((song) =>
    <li class="flex-row" key={song}>
			<a style={{width: '100%'}}class="collection-item"
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
        <h4>Pick A Song From The Library</h4>
        <ul class="collection" style={{listStyle: 'none'}}>{this.listItems}</ul>
			</div>
		);
	};
}

export default Library;

