import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, browserHistory } from 'react-router'

import './App.css';
import appStore from './reducers'
import Splash from './components/splash/Splash'
import DraftBoard from './components/draft/DraftBoard'
import DraftPick from './components/draft/DraftPick'
import LoginModal from './components/login/LoginModal'
import Login from './components/login/Login'

let store = createStore(appStore, applyMiddleware(thunk))

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className='App'>
          <Router history={browserHistory}>
            <Route path="/" component={Splash} />
            <Route path="/drafts/:draft_id" component={DraftBoard} />
            <Route path="/drafts/:draft_id/picks" component={DraftPick} />
            <Route path="/login" component={Login} />
          </Router>
          <LoginModal caller={this} />
        </div>
      </Provider>
    );
  }
}

export default App;
