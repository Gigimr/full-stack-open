import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('Blog Test', () => {

  test('renders content', () => {
    const blog  = {
      title: 'Component testing is done with react-testing-library',
      author : 'John',
      url: 'http://localhost.com',
      likes: 12
    };
    const { container } = render(<Blog blog={blog} />);

    let blogTitle = container.querySelector('#blogTitle');
    let blogAuthor = container.querySelector('#blogAuthor');

    expect(blogTitle).toHaveTextContent('Component testing is done with react-testing-library');
    expect(blogAuthor).toHaveTextContent('John');
    expect(blogTitle).toBeTruthy();
    expect(blogAuthor).toBeTruthy();
  });

  test('check that the blog url and number of likes are displayed when clicked', async () => {
    const blog  = {
      title: 'Component testing is done with react-testing-library',
      author : 'John',
      url: 'http://localhost.com',
      likes: 12
    };

    const { container } = render(<Blog blog={blog}/>);
    let blogUrl = container.querySelector('#blogUrl');
    let blogLikes = container.querySelector('#blogLikes');
    expect(blogLikes).toBeFalsy();
    expect(blogUrl).toBeFalsy();

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    blogUrl = container.querySelector('#blogUrl');
    blogLikes = container.querySelector('#blogLikes');
    expect(blogUrl).toBeTruthy();
    expect(blogLikes).toBeTruthy();

    const hideButton = screen.getByText('hide');
    await user.click(hideButton);

    blogUrl = container.querySelector('#blogUrl');
    blogLikes = container.querySelector('#blogLikes');
    expect(blogLikes).toBeFalsy();
    expect(blogUrl).toBeFalsy();
  });

  test('check that the like button is clicked twice', async () => {

    const blog  = {
      title: 'Component testing is done with react-testing-library',
      author : 'John',
      url: 'http://localhost.com',
      likes: 12
    };

    const addingLikesMock = jest.fn();

    const { container } = render(<Blog blog={blog} addingLikes={addingLikesMock}/>);

    const user = userEvent.setup();
    const viewButton = screen.getByText('view');
    await user.click(viewButton);
    
    const likeButton = screen.getByText('like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(addingLikesMock).toHaveBeenCalledTimes(2);
  });

});
