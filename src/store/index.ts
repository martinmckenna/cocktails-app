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

import accountReducer, {
  initialState as accountState,
  State as AccountState
} from './account/account.reducer';
import authReducer, {
  initialState as authState,
  State as AuthState
} from './authentication/authentication.reducer';

const rootReducer = combineReducers<State>({
  authState: authReducer,
  accountState: accountReducer
});

interface State {
  authState: AuthState;
  accountState: AccountState;
}

const reduxDevTools = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

const defaultState: State = {
  authState,
  accountState
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

export type MapStateToProps<StateProps, OwnProps> = _MapStateToProps<
  StateProps,
  OwnProps,
  State
>;

export type MapDispatchToProps<TDisProps, TOwnProps> = _MapDispatchToProps<
  TDisProps,
  TOwnProps
>;
