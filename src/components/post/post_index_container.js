import { connect } from 'react-redux';
import PostIndex from './post_index';
import { requestPosts, clearPosts } from '../../actions/post_actions';
import { selectAllPosts } from '../../reducers/selectors';

const mapStateToProps = (state) => {
  return {
    posts: selectAllPosts(state.posts),
  };
};

const mapDispatchToProps = dispatch => ({
  requestPosts: (afterString, postCount, subreddit) => dispatch(requestPosts(afterString, postCount, subreddit)),
  clearPosts: () => dispatch(clearPosts()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostIndex);
