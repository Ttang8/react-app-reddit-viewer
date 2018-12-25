import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import PostIndexContainer from './components/post/post_index_container';

class App extends Component {
  render() {
    return (
      <div>
        <PostIndexContainer />
        <footer></footer>
      </div>
    );
  }
}

export default App;
