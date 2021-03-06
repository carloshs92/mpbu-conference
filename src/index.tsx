import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router>
        <div>
            <Route exact={true} path="/:id" component={App} />
        </div>
    </Router>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
