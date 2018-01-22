import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import appStore from './stores/appStore';
import { observer } from 'mobx-react';

import './App.css';

function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

@observer
class App extends Component {
  componentWillMount() {
    appStore.init();
  }
  
  render() {
    return (
      <Router>
        <div className="App">
          <PrivateRoute authed={appStore.isLoggedIn} path='/' exact component={HomePage} />
          <Route path='/login' component={LoginPage} />
        </div>
      </Router>
    );
  }
}

export default App;