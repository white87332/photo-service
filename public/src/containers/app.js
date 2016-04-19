import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore.js';
import { syncHistoryWithStore } from 'react-router-redux';

// store
const store = configureStore();

// react-router-redux
const history = syncHistoryWithStore(browserHistory, store);

// lazy load component
const loadComponentAsync = bundle => (location, callback) =>
{
	bundle(component => {
		callback(null, component.default);
	});
};

const routes = (
	<Router history={history}>
		<Route getComponent={loadComponentAsync(require('bundle?lazy&name=main!../components/main/main'))} >
			<Route path="/photo/login" getComponent={loadComponentAsync(require('bundle?lazy&name=login!../components/login/login'))} />

			<Route getComponent={loadComponentAsync(require('bundle?lazy&name=layout!../components/layout/layout'))}>
				<Route path="/photo/fileList" getComponent={loadComponentAsync(require('bundle?lazy&name=fileList!../components/fileList/fileList'))} />
			</Route>

			<Route path="/photo/*" getComponent={loadComponentAsync(require('bundle?lazy&name=login!../components/login/login'))} />
		</Route>
    </Router>
);

render(
	<Provider store={store}>
		{routes}
	</Provider>,
	document.getElementById('root')
);
