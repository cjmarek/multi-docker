import { render, screen } from '@testing-library/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

test('renders learn react link', () => {});

//this original code will fail because when the App component is rendered, it will try to render the
//Fib component, and the Fib component is going to try to make a request to the back end Express server
// that is not running from the container yet. So we removed this test because the test needs to be guaranteed to work.
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';


// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App />, div);
//     ReactDOM.unmountComponentAtNode(div);
// });
