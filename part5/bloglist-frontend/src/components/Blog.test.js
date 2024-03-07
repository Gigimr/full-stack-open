import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('renders content', () => {
  const blog  = {
    title: 'Component testing is done with react-testing-library',
    author : 'John',
    url: 'http://localhost.com',
    likes: 12
  };
  const { container } = render(<Blog blog={blog} />);

  screen.debug();

  const div = container.querySelector('.unvisible');

  expect(div).toHaveTextContent('Component testing is done with react-testing-library John');
//   expect(div).toBeInTheDocument();

//   expect(div).toHaveTextContent(blog.title);
//   expect(div).toHaveTextContent(blog.author);

  //  URL y los likes no se muestren
  // expect(div).not.toHaveTextContent(blog.url);
  // expect(div).not.toHaveTextContent(`${blog.likes} likes`);
});
