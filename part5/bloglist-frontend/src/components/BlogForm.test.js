import React from 'react';
import { getByAltText, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

test('<BlogForm/> updates parent state and calls onSubmit',async () => {

  const createBlogMock = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm createBlog={createBlogMock} />);

  const titleInput = screen.getByPlaceholderText('write tittle here');
  const authorInput = screen.getByPlaceholderText('write author here');
  const urlInput = screen.getByPlaceholderText('write url here');
  const createButton = screen.getByText('create');

  await user.type(titleInput, 'El gigito');
  await user.type(authorInput, 'Davinci');
  await user.type(urlInput, 'gigito.com');
  await user.click(createButton);


  expect(createBlogMock.mock.calls[0][0].title).toBe('El gigito');
  expect(createBlogMock.mock.calls[0][0].author).toBe('Davinci');
  expect(createBlogMock.mock.calls[0][0].url).toBe('gigito.com');
  expect(createBlogMock).toHaveBeenCalledTimes(1);



});