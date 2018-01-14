import React, { Component } from 'react';

class ListItem extends Component {

  render () {
    return (
      <div>
        <li class="flex-row" key={this.props.song.id}>
          <a style={{width: '100%'}} class="collection-item"
            href="/songListItem/"
            onClick={this.props.clicked.bind(this)}
            >{this.props.song.fileName}
          </a>
          <button
            onClick={(event) => this.props.deleteClick(event, this.props.song.id)}
            style={{
              float: 'right'
            }}
            class="waves-effect waves-lite btn">
              <i class="material-icons center">delete_forever</i>
          </button>
        </li>
      </div>
    );
  };

}

export default ListItem;
