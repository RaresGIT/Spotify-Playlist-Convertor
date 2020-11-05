import React from 'react';
import { render, screen,cleanup, fireEvent } from 'react-dom';
import App from './App';
import { act } from 'react-dom/test-utils';


//afterEach(cleanup);

//jest.mock("./")
it("should render app", () => {
  let container = document.createElement('div');
  document.body.appendChild(container);


  act(() =>{

    render(
    <App></App>,container
  ) 
  })

  const loginSpotifyButton = container.querySelector('[href="localhost:8888/login"]');
  const loginGoogleButton = container.querySelector('[href="localhost:8889/auth"]');
  const profilePic = container.querySelector('[id="profilepic"]');
  expect(
  loginSpotifyButton
  ).not.toBeFalsy();

  expect(loginGoogleButton).not.toBeFalsy();
  expect(profilePic).not.toBeFalsy();
  
  
  
})
