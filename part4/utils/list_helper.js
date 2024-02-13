const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item;
  };
  const blogslikes = blogs.map((blog) => blog.likes);

  return blogslikes.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const blogslikes = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...blogslikes);
  const favInfo = blogs.find((blog) => blog.likes == maxLikes);
  return {
    title: favInfo.title,
    author: favInfo.author,
    likes: favInfo.likes,
  };
};
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }
  const groupedByAuthor = _.groupBy(blogs, 'author');

  const authorWithMostBlogs = _.maxBy(
    Object.keys(groupedByAuthor),
    (author) => groupedByAuthor[author].length
  );

  const mostBlogsCount = groupedByAuthor[authorWithMostBlogs].length;

  return {
    author: authorWithMostBlogs,
    blogs: mostBlogsCount,
  };
};
const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author');

  const authorWithMostLikes = _.maxBy(Object.keys(groupedByAuthor), (author) =>
    _.sumBy(groupedByAuthor[author], 'likes')
  );

  const mostLikesCount = _.sumBy(groupedByAuthor[authorWithMostLikes], 'likes');

  return {
    author: authorWithMostLikes,
    likes: mostLikesCount,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
