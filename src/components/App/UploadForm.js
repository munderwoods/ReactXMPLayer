import React, { Component } from 'react';


  function sendFormData(data) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8000/api/songs/upload', true);
    xmlhttp.setRequestHeader('Content-type', 'text/plain');
    xmlhttp.send(data);
  }
class UploadForm extends Component {


  handleSubmit(event) {
    //let data = document.getElementById('songUpload').value;
    event.preventDefault();
    sendFormData();
  }

	render () {
		return (
			<div>
        <h4>Or Upload One Of Your Own!</h4>
        <form onSubmit={this.handleSubmit} action="">
          <div  style={{overflow: 'hidden', whiteSpace: 'nowrap'}}class="file-field input-field">
            <div class="flex-row">
            <div class="btn">
              <span>File</span>
              <input type="file" multiple />
            </div>
            <div style={{width: "100%", paddingRight: "10px"}}class="file-path-wrapper">
              <input class="file-path validate" type="text" placeholder="Upload one or more files" />
            </div>
							<button class="btn waves-effect waves-light" type="submit" name="action">Submit
								<i class="material-icons right">send</i>
							</button>
            </div>
          </div>
        </form>
      </div>
		);
	};
}
export default UploadForm;

