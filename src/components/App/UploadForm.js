import React, { Component } from 'react';


class UploadForm extends Component {
	render () {
		return (
			<div>
        <h3>Or Upload One Of Your Own!</h3>
        <form action="">
          <input type="file"></input>
          <button type="submit">Submit</button>
        </form>
			</div>
		);
	};
}
export default UploadForm;

