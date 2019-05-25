import { APIError } from 'src/services/types';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  handleLogin,
  handleLogout,
  initSession
} from './authentication.actions';

export interface State {
  token: string;
  expiry: string;
  isLoggingIn: boolean;
  loginError?: APIError;
}

export const initialState: State = {
  token: '',
  expiry: '',
  isLoggingIn: false
};

const localStorageKey = 'barcart/auth/token';

const reducer = reducerWithInitialState(initialState)
  .case(handleLogin.started, state => {
    return {
      ...state,
      isLoggingIn: true,
      loginError: undefined
    };
  })
  .caseWithAction(handleLogin.done, (state, action) => {
    /** set token in local storage */
    localStorage.setItem(localStorageKey, action.payload.result.token);

    return {
      ...state,
      isLoggingIn: false,
      token: action.payload.result.token
    };
  })
  .caseWithAction(handleLogin.failed, (state, action) => {
    return {
      ...state,
      isLoggingIn: false,
      loginError: action.payload.error
    };
  })
  .case(handleLogout, state => {
    localStorage.removeItem(localStorageKey);

    return {
      ...state,
      token: '',
      isLoggingIn: false
    };
  })
  .case(initSession, state => {
    /** read token from local storage */
    const token = localStorage.getItem(localStorageKey) || '';

    return {
      ...state,
      token
    };
  })
  .default(state => ({ ...state }));

export default reducer;
