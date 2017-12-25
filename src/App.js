import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Play a Jam!</h1>
          <h4 className="XM Title">Selected XM Name Goes Here.xm</h4>
          <button id="previous">Previous</button>
          <button id="play">Play</button>
          <button id="stop">Stop</button>
          <button id="next">Next</button>
        </header>
        <h3>Select A Song From The Library</h3>
        <br />
        <ul >
          <li>song.xm</li>
          <li>song.xm</li>
          <li>song.xm</li>
          <li>song.xm</li>
        </ul>
        <br />
        <h3>Or Upload Your Own</h3>
        <input type="file" />
      </div>
    );
  }
}

export default App;
