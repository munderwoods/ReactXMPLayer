import React, { Component } from 'react';

class ListItem extends Component {

  render () {
    return (
      <div>
        <li className="flex-row" key={this.props.song.id}>
          <a style={{width: '100%'}} className="collection-item"
            href="/songListItem/"
            onClick={(event) => this.props.clicked(event, this.props.song.id)}
            >{this.props.song.fileName}
          </a>
          <button
            onClick={(event) => this.props.deleteClick(event, this.props.song.id, this.props.song.fileName)}
            style={{
              float: 'right'
            }}
            className="waves-effect waves-lite btn">
              <i className="material-icons center">delete_forever</i>
          </button>
        </li>
      </div>
    );
  };

}

export default ListItem;
