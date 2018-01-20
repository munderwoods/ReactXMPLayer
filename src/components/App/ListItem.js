import React from 'react';

function ListItem(props) {
  return (
    <div>
      <li className="flex-row" key={props.song.id}>
        <a style={{width: '100%'}} className="collection-item"
          href="/songListItem/"
          onClick={(event) => props.clicked(event, props.song.id)}
          >{props.song.fileName}
        </a>
        <button
          onClick={(event) => props.deleteClick(event, props.song.id, props.song.fileName)}
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


export default ListItem;
