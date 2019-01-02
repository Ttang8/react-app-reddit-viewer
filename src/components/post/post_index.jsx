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

    this.props.clearErrors();

    this.handleClick = this.handleClick.bind(this);
    this.handleNSFW = this.handleNSFW.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateIsLoaded = this.updateIsLoaded.bind(this);
    this.createArray = this.createArray.bind(this);
  }

  componentDidMount() {
    if(localStorage.hasOwnProperty('array')) {
      this.hydrateStateWithLocalStorage();
      let length = JSON.parse(localStorage.getItem('array')).length;
      let title = JSON.parse(localStorage.getItem('title'));
      this.props.requestPosts("", "", title, length)
        .then(() => this.createArray())
        .then(() => this.setState({isLoaded: true}))
        .then(() => this.handleAfter())
    } else {
      this.props.requestPosts(this.state.afterString, this.props.posts.length, this.state.title)
      .then(() => this.createArray())
      .then(() => this.setState({isLoaded: true}))
      .then(() => this.handleAfter())
    }
    window.addEventListener(
      "beforeunload",
      this.saveState.bind(this)
    );
  }

  componentWillUnmount() {
    window.removeEventListener(
      "beforeunload",
      this.saveState.bind(this)
    );
    this.saveState();
  }

  saveState() {
    for(let key in this.state) {
      if (key === 'isLoaded') {
        localStorage.setItem(key, false)
      } else {
        localStorage.setItem(key, JSON.stringify(this.state[key]));
      }
    }
  }

  hydrateStateWithLocalStorage() {
    for(let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key);
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          this.setState({ [key]: value });
        }
      }
    }
  }

  updateTitle(title) {
    this.setState({ title: title});
  }

  updateIsLoaded() {
    if(this.state.isLoaded) {
      this.setState({ isLoaded: false });
    } else {
      this.setState({ isLoaded: true });
    }
  }

  handleAfter () {
    this.setState({afterString: this.props.posts[this.props.posts.length-1].data.name});
  }

  createArray() {
    let array = this.props.posts.map((post) => {
      if (post.data.url.includes('png') || post.data.url.includes('jpg') || post.data.url.includes('gif') || post.data.url.includes('gfycat') || post.data.url.includes('youtube')) {
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
      let postTitle = this.props.posts[idx].data.title;
      if(postTitle.length > 50) {
        postTitle = postTitle.slice(0, 50).concat('...')
      }
      if (!this.state.viewNsfw) {
        if (this.props.posts[idx]) {
          if (this.props.posts[idx].data.parent_whitelist_status) {
            if (this.props.posts[idx].data.parent_whitelist_status.includes('nsfw')) {
              return(<li key={idx}></li>);
            }
          }
        }
      }
      if (post === undefined) {
        return(<li key={idx}></li>);
      } else if(post.includes('png') || post.includes('jpg')) {
        return(
          <li className="image deactive" key={idx}>
            <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
              <div className="image_overlay">
                <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                  {postTitle}
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
        let gfyurl = "https://gfycat.com/ifr/" + post.slice(index);
          return(
            <li className="image deactive" key={idx}>
              <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
                <div className="image_overlay">
                  <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                    {postTitle}
                  </div>
                </div>
                <iframe title={postTitle} className="gfycat" src={gfyurl} scrolling="no" frameBorder="0" allow="autoplay; fullscreen" allowFullScreen={true}></iframe>
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
                    {postTitle}
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
                    {postTitle}
                  </div>
                </div>
                <img src={post} alt={post.title}></img>
              </a>
            </li>
          );
        }
      } else if (post.includes('youtube')){
        let url = this.props.posts[idx].data.url.replace('watch?v=', 'embed/')
        return(
          <li className="ytvideo" key={idx}>
            <a href={this.props.posts[idx].data.url} target="_blank" rel="noopener noreferrer">
              <div className="image_overlay">
                <div className="title_hover" onClick={this.handleReddit.bind(this)} data-link={`https://reddit.com${this.props.posts[idx].data.permalink}`}>
                  {postTitle}
                </div>
              </div>
              <iframe title={postTitle} height="300" width="500px" src={url} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </a>
          </li>
        )

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
                  {postTitle}
                </div>
              </div>
              <img src={url} alt={post.title}></img>
            </a>
          </li>
        );
      });
      }else {
        return(<li key={idx}></li>);
      }
    });
    return posts;
  }

  renderErrors(){
    if(this.props.errors[0]) {
      return(
        <div>
          {`r/${this.state.title} does not exist yet. Try another subreddit.`}
        </div>
      );
    }
  }

  handleLayoutComplete(laidoutitems) {
    setTimeout(() => laidoutitems.forEach(img => {
      img.element.className = "image active";
    }), 1000);
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
          <SearchBar title={this.state.title} viewNsfw={this.state.viewNsfw} handleNSFW={this.handleNSFW} createArray={this.createArray} updateIsLoaded={this.updateIsLoaded} requestPosts={this.props.requestPosts} clearPosts={this.props.clearPosts} updateTitle={this.updateTitle}/>
          <br/>
          <div className="errors">
            {this.renderErrors()}
          </div>
          <Masonry
            className={'my-gallery-class'}
            elementType={'ul'}
            options={masonryOptions}
            onLayoutComplete={laidOutItems => this.handleLayoutComplete(laidOutItems)}
            >
            {this.renderPosts()}
          </Masonry>
          <div className="load-button">
            <button className="load_button" onClick={this.handleClick}>Load More</button>
          </div>
        </div>
      )
    }
  }
}

export default PostIndex;
