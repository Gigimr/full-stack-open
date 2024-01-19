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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
