import React, {Component} from 'react';
import Masonry from 'react-masonry-component';
import SearchBar from '../search_bar/search_bar';

const masonryOptions = {
    transitionDuration: 0
};

class PostIndex extends Component {
  constructor(props) {
    super(props);

    this.state = {
      afterString: "",
      viewNsfw: false,
      title: "all",
      isLoaded: false,
      array: []
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleNSFW = this.handleNSFW.bind(this);
  }

  componentDidMount() {
    this.props.requestPosts(this.state.afterString, this.props.posts.length, this.state.title)
      .then(() => this.createArray())
      .then(() => this.setState({isLoaded: true}))
      .then(() => this.handleAfter())
  }

  handleAfter () {
    this.setState({afterString: this.props.posts[this.props.posts.length-1].data.name});
  }

  createArray() {
    let array = this.props.posts.map((post) => {
      if (post.data.url.includes('png') || post.data.url.includes('jpg') || post.data.url.includes('gif') || post.data.url.includes('gfycat')) {
        return post.data.url;
      } else {
        return post.data.thumbnail;
      }
    });
      this.setState({array: array});
  }

  handleReddit(e) {
    e.preventDefault();
    window.open(e.target.dataset.link, '_blank');
  }

  renderPosts () {
    let posts = this.state.array.map((post,idx) => {
      if (!this.state.viewNsfw) {
        if (this.props.posts[idx]) {
          if (this.props.posts[idx].data.parent_whitelist_status) {
            if (this.props.posts[idx].data.parent_whitelist_status.includes('nsfw')) {
              return;
            }
          }
        }
      }
      if (post === undefined) {
        return;
      } else if(post.includes('png') || post.includes('jpg')) {
        return(
          <li className="image deactive" key={idx}>
            <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
              <div className="image_overlay">
                <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                  {this.props.posts[idx].data.title}
                </div>
              </div>
              <img src={post} alt={post.title}></img>
            </a>
          </li>
        );
      } else if (post.includes('gfycat')) {
        let index;
        if (post.includes('detail/')) {
          index = post.indexOf('detail/') + 7;
        } else {
          index = post.indexOf('.com/') + 5;
        }
        let gfyurl = "https://giant.gfycat.com/" + post.slice(index) + ".mp4";
          return(
            <li className="image deactive" key={idx}>
              <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
                <div className="image_overlay">
                  <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                    {this.props.posts[idx].data.title}
                  </div>
                </div>
                <video autoPlay muted loop poster={this.props.posts[idx].data.thumbnail}>
                  <source src={gfyurl} type="video/mp4"/>
                  <img src={this.props.posts[idx].data.thumbnail} alt={post.title}></img>
                </video>
              </a>
            </li>
          );
        } else if (post.includes('gif')){
        if (post[post.length-1] === 'v') {
          let index = post.indexOf('.gifv');
          let videourl = post.slice(0, index) + ".mp4";
          return(
            <li className="image deactive" key={idx}>
              <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
                <div className="image_overlay">
                  <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                    {this.props.posts[idx].data.title}
                  </div>
                </div>
                <video autoPlay muted loop src={videourl}></video>
              </a>
            </li>
          );
        } else {
          return(
            <li className="image deactive" key={idx}>
              <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
                <div className="image_overlay">
                  <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                    {this.props.posts[idx].data.title}
                  </div>
                </div>
                <img src={post} alt={post.title}></img>
              </a>
            </li>
          );
        }
      } else if (post.includes('imgur')) {
        let imgrurl = post;
        this.props.scrapeImgur(imgrurl)
          .then(() => {
            let string = this.props.imgurUrl;
            let index = string.indexOf('i.imgur');
            let url = string.slice(index);
        return(
          <li className="image deactive" key={idx}>
            <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
              <div className="image_overlay">
                <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                  {this.props.posts[idx].data.title}
                </div>
              </div>
              <img src={url} alt={post.title}></img>
            </a>
          </li>
        );
      });
      }else {
        return;
      }
    });
    return posts;
  }

  handleLayoutComplete(laidoutitems) {
    setTimeout(() => laidoutitems.forEach(img => {
      img.element.className = "image active";
    }), 2500);
  }

  handleNSFW (e) {
    e.preventDefault();
    if (this.state.viewNsfw) {
      this.setState({viewNsfw: false});
    } else {
      this.setState({viewNsfw: true});
    }
  }

  handleClick (e) {
    e.preventDefault();
    this.props.requestPosts(this.state.afterString, this.props.posts.length, this.state.title)
      .then(() => this.handleAfter())
      .then(() => this.createArray());
  }

  render() {
    const {isLoaded} = this.state;
    if(!isLoaded) {
      return (<div>Loading...</div>)
    } else {
      return(
        <div>
          <SearchBar props={this.props}/>
          {`r/${this.state.title}`}
          <br/>
          <button onClick={this.handleNSFW} >{this.state.viewNsfw ? "nsfw on" : "nsfw off"}</button>
          <Masonry
            className={'my-gallery-class'}
            elementType={'ul'}
            options={masonryOptions}
            onLayoutComplete={laidOutItems => this.handleLayoutComplete(laidOutItems)}
            >
            {this.renderPosts()}
          </Masonry>
          <div className="load-button">
            <button onClick={this.handleClick}>Load More</button>
          </div>
        </div>
      )
    }
  }
}

export default PostIndex;
