import * as APIUtil from '../util/reddit_api_util';

export const RECEIVE_POSTS = "RECEIVE_POSTS";
export const CLEAR_POSTS = "CLEAR_POSTS";
export const RECEIVE_HTML = "RECEIVE_HTML";
export const RECEIVE_ERRORS = "RECEIVE_ERRORS";
export const CLEAR_ERRORS = "CLEAR_ERRORS";

export const receivePosts = object => ({
  type: RECEIVE_POSTS,
  posts: object.data.children
});

export const clearPosts = () => ({
  type: CLEAR_POSTS,
});

export const receiveHtml = (imageUrl) => ({
  type: RECEIVE_HTML,
  imageUrl
});

export const receiveErrors = errors => ({
  type: RECEIVE_ERRORS,
  errors
});

export const clearErrors = () => ({
  type: CLEAR_ERRORS
});



export const requestPosts = (afterString, postCount, subreddit, limit) => dispatch => (
  APIUtil.requestPosts(afterString, postCount, subreddit, limit)
    .then(posts => dispatch(receivePosts(posts))
  ),errors => (
    dispatch(receiveErrors(errors.responseJSON))
  )
);
