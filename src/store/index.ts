import { applyMiddleware, combineReducers, compose, createStore } from 'redux';

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
    // applyMiddleware(),
    reduxDevTools ? reduxDevTools() : (arg: any) => arg
  )
);
