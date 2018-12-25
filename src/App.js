import React, { Component } from 'react';
import { Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import PostIndexContainer from './components/post/post_index_container';

class App extends Component {
  render() {
    return (
      <div>
        <Route exact path='/' component={PostIndexContainer} />
        <footer></footer>
      </div>
    );
  }
}

export default App;
