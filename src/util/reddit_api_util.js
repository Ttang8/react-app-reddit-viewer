import $ from 'jquery';

export const requestPosts = (afterString = "", postCount = "", subreddit = "all", limit = 25) => (
  $.ajax({
    method: 'GET',
    url: `https://www.reddit.com/r/${subreddit}.json?limit=${limit}&after=${afterString}&count=${postCount}`,
    dataType: "json"
  })
);
