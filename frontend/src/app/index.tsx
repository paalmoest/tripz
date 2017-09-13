import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, Route, Router } from 'react-router';
import { App } from './ts/App';
async function Init() {
  ReactDOM.render(
    (
      <Router history={browserHistory}>
        <Route path='/' component={App} />
      </Router>
    ),
    document.getElementById('page')
  );

}

Init();
