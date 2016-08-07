import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, browserHistory } from 'react-router'

import './App.css';
import appStore from './reducers'
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
            <Route path="/" component={DraftBoard} />
            <Route path="/login" component={Login} />
            <Route path="/board" component={DraftBoard} />
            <Route path="/pick" component={DraftPick} />
          </Router>
          <LoginModal caller={this} />
        </div>
      </Provider>
    );
  }
}

export default App;
