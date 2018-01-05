import React, { Component } from 'react';


class UploadForm extends Component {


  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.upload = this.upload.bind(this);
  };
  upload(file) {
		console.log(this.fileInput);
		var formData = new FormData();
		formData.append('songFile', file);
		console.log(file);
		console.log(formData);
    fetch('/api/songs/upload', {
      method: 'POST',
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: file
    }).then(
      response => response.json()
    ).then(
      success => console.log(success),
    ).catch(
      error => console.log(error),
    );
  };


  handleSubmit(files) {
    files.preventDefault();
    const file = this.fileInput.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
		reader.onloadend = () => this.upload(reader.result);
  };

	render () {
		return (
			<div>
        <h4>Or Upload One Of Your Own!</h4>
        <form onSubmit={this.handleSubmit} action="">
          <div  style={{overflow: 'hidden', whiteSpace: 'nowrap'}}class="file-field input-field">
            <div class="flex-row">
            <div class="btn">
              <span>File</span>
              <input ref={(input) => { this.fileInput = input; }} type="file" multiple />
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

