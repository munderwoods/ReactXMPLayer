import React, { Component } from 'react';


  function sendFormData(data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8000/songListItem', true);
    xmlhttp.setRequestHeader('Content-type', 'text/plain');
    xmlhttp.send(data);
  }
class UploadForm extends Component {


  handleSubmit(event) {
    let data = document.getElementById('songUpload').value;
    event.preventDefault();
    sendFormData(data);
  }

	render () {
		return (
			<div>
        <h3>Or Upload One Of Your Own!</h3>
        <form onSubmit={this.handleSubmit} action="">
          <input id="songUpload" type="file"></input>
          <button type="submit">Submit</button>
        </form>
			</div>
		);
	};
}
export default UploadForm;

