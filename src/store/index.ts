import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

const rootReducer = combineReducers({});

const defaultState = {};

export default createStore(
  rootReducer,
  defaultState,
  applyMiddleware(
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  )
);
