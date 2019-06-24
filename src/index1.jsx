/* eslint-disable no-console */
/** @module index1
 *  @descr Dog CEO API: Version 1: redux
 *  @since 2019.06.21, 09:55
 *  @changed 2019.06.21, 10:16
 */

import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import connect from 'react-redux/es/connect/connect';
import { createStore } from 'redux';

// Reducer
const initialState = {
  url: '',
  loading: false,
  error: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUESTED_DOG':
      return {
        url: '',
        loading: true,
        error: false,
      };
    case 'REQUESTED_DOG_SUCCEEDED':
      return {
        url: action.url,
        loading: false,
        error: false,
      };
    case 'REQUESTED_DOG_FAILED':
      return {
        url: '',
        loading: false,
        error: true,
      };
    default:
      return state;
  }
};

// Action Creators
const requestDog = () => {
  return { type: 'REQUESTED_DOG' };
};

const requestDogSuccess = (data) => {
  return { type: 'REQUESTED_DOG_SUCCEEDED', url: data.message };
};

const requestDogError = () => {
  return { type: 'REQUESTED_DOG_FAILED' };
};

const fetchDog = (dispatch) => {
  dispatch(requestDog());
  return fetch('https://dog.ceo/api/breeds/image/random')
    .then(res => res.json())
    .then(
      data => dispatch(requestDogSuccess(data)),
      err => dispatch(requestDogError(err))
    );
};

// Component
class App extends React.Component {
  render () {
    return (
      <div>
        <button onClick={() => fetchDog(this.props.dispatch)}>Show Dog</button>
          {this.props.loading
            ? <p>Loading...</p>
            : this.props.error
                ? <p>Error, try again</p>
                : <p><img src={this.props.url}/></p>}
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  url: PropTypes.string.isRequired,
};

// Store
const store = createStore(reducer);

const ConnectedApp = connect((state) => {
  console.log(state);
  return state;
})(App);

// Container component
render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
