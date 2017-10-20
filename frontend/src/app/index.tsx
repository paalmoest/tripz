import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, Route, Router } from 'react-router';
import { App } from './ts/App';
import { Destination } from './ts/Destination';
async function Init() {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={App} />
            <Route path="/destination/(:id)" component={Destination} />
        </Router>,
        document.getElementById('page')
    );
}

Init();
