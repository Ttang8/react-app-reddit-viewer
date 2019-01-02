import { connect } from 'react-redux';
import PostIndex from './post_index';
import { requestPosts, clearPosts, clearErrors } from '../../actions/post_actions';
import { selectAllPosts } from '../../reducers/selectors';

const mapStateToProps = ({posts, errors}) => {
  return {
    posts: selectAllPosts(posts),
    errors: errors
  };
};

const mapDispatchToProps = dispatch => ({
  requestPosts: (afterString, postCount, subreddit, limit) => dispatch(requestPosts(afterString, postCount, subreddit, limit)),
  clearPosts: () => dispatch(clearPosts()),
  clearErrors: () => dispatch(clearErrors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostIndex);
