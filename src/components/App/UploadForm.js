import React, { Component } from 'react';



class UploadForm extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  };


  handleSubmit(files) {
    files.preventDefault();
    const file = this.fileInput.files[0];
		this.props.upload(file);
  };

	render () {
		return (
			<div>
        <h4>Or Upload One Of Your Own!</h4>
        <form onSubmit={this.handleSubmit} action="">
          <div style={{overflow: 'hidden', whiteSpace: 'nowrap'}} className="file-field input-field">
            <div className="flex-row">
            <div className="btn">
              <span>File</span>
              <input ref={(input) => { this.fileInput = input; }} type="file" multiple />
            </div>
            <div style={{width: "100%", paddingRight: "10px"}} className="file-path-wrapper">
              <input className="file-path validate" type="text" placeholder="Choose a .xm file" />
            </div>
							<button className="btn waves-effect waves-light" type="submit" name="action">Submit
								<i className="material-icons right">send</i>
							</button>
            </div>
          </div>
        </form>
      </div>
		);
	};
}
export default UploadForm;

