import {
  MapDispatchToProps as _MapDispatchToProps,
  MapStateToProps as _MapStateToProps
} from 'react-redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { AnyAction } from 'redux';
import thunk, {
  ThunkAction as _ThunkAction,
  ThunkDispatch as _ThunkDispatch
} from 'redux-thunk';

import authReducer, {
  initialState as authState,
  State as AuthState
} from './authentication/authentication.reducer';

const rootReducer = combineReducers<State>({
  authState: authReducer
});

interface State {
  authState: AuthState;
}

const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const defaultState: State = {
  authState
};

export default createStore(
  rootReducer,
  defaultState,
  compose(
    applyMiddleware(thunk),
    reduxDevTools ? reduxDevTools() : (arg: any) => arg
  )
);

export type ThunkAction<R> = _ThunkAction<
  Promise<R>,
  State,
  undefined,
  AnyAction
>;

export type ThunkDispatch = _ThunkDispatch<State, undefined, AnyAction>;

export type MapStateToProps<S, P> = _MapStateToProps<S, P, State>;

export type MapDispatchToProps<S, P> = _MapDispatchToProps<S, P>;
