import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StaticRouter } from 'react-router';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const context = {};
  ReactDOM.render(
    <StaticRouter location="/" context={context}>
      <App />
    </StaticRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
