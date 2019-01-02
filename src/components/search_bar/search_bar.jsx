import React, {Component} from 'react';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subreddit: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  update(field) {
    return event => this.setState({[field]: event.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    const title = this.state.subreddit ? this.state.subreddit : 'all'
    this.props.clearErrors();
    this.props.clearPosts();
    this.props.updateIsLoaded();
    this.props.requestPosts("",0,title)
      .then(() => this.props.createArray())
      .then(() => this.props.updateTitle(title))
      .then(() => this.props.updateIsLoaded())
  }

  render() {
    return(
      <div className="header">
        <button className={`load_button ${this.props.viewNsfw ? "red_button" : ""}`} onClick={this.props.handleNSFW} >{this.props.viewNsfw ? "nsfw on" : "nsfw off"}</button>
        <form onSubmit={this.handleSubmit}>
          <input placeholder="Subreddit" type="text" autoFocus="autofocus" value={this.state.subreddit} onChange={this.update('subreddit')}></input>
          <input className="load_button" type="submit" value="Search"></input>
        </form>
        {`r/${this.props.title}`}
      </div>
    )
  }
};

export default SearchBar;
