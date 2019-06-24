/* eslint-disable no-console */
/** @module index3
 *  @descr Dog CEO API: Version 3: redux-saga
 *  @since 2019.06.24, 10:27
 *  @changed 2019.06.24, 10:27
 */

import '@babel/polyfill';

import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import connect from 'react-redux/es/connect/connect';
import { createStore, applyMiddleware } from 'redux';

import createSagaMiddleware from 'redux-saga';
import {
  call,
  put,
  takeEvery,
  // takeLatest,
} from 'redux-saga/effects';

// Reducer
const initialState = {
  url: '',
  loading: false,
  error: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_DOG':
      return {
        url: '',
        loading: true,
        error: false,
      };
    case 'REQUEST_DOG_SUCCESS':
      return {
        url: action.url,
        loading: false,
        error: false,
      };
    case 'REQUEST_DOG_ERROR':
      return {
        url: '',
        loading: false,
        error: true,
      };
    case 'FETCH_DOG':
    default:
      return state;
  }
};

// Action Creators
const requestDog = () => {
  return { type: 'REQUEST_DOG' };
};

const requestDogSuccess = (data) => {
  return { type: 'REQUEST_DOG_SUCCESS', url: data.message };
};

const requestDogError = () => {
  return { type: 'REQUEST_DOG_ERROR' };
};

const fetchDog = () => {
  return { type: 'FETCH_DOG' };
};

// Sagas
function* watchFetchDog() {
  yield takeEvery('FETCH_DOG', fetchDogAsync);
}

function* fetchDogAsync() {
  try {
    yield put(requestDog());
    const data = yield call(() => {
      return fetch('https://dog.ceo/api/breeds/image/random')
        .then(res => res.json());
    });
    yield put(requestDogSuccess(data));
  } catch (error) {
    yield put(requestDogError());
  }
}

// Component
class App extends React.Component {
  render () {
    console.log('render', this.props);
    return (
      <div>
        <button onClick={() => this.props.dispatch(fetchDog())}>Show Dog</button>
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
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(watchFetchDog);

const ConnectedApp = connect((state) => {
  console.log('connect', state);
  return state;
})(App);

// Container component
render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
