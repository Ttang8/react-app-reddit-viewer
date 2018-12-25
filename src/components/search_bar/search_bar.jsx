import React, {Component} from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subreddit: ""
    };
  }

  update(field) {
    return event => this.setState({[field]: event.target.value});
  }

  handleSubmit() {

  }

  render() {
    console.log(this.props);
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="Subreddit" type="text" autoFocus="autofocus" value={this.state.subreddit} onChange={this.update('subreddit')}></input>
          <input type="submit" value="Submit"></input>
        </form>
      </div>
    )
  }
};

export default SearchBar;
