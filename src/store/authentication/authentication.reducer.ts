import { APIError } from 'src/services/types';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { handleLogin, handleLogout } from './authentication.actions';

interface State {
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

const reducer = reducerWithInitialState(initialState)
  .caseWithAction(handleLogin.started, (state, action) => {
    return {
      ...state
    };
  })
  .caseWithAction(handleLogin.done, (state, action) => {
    return {
      ...state
    };
  })
  .caseWithAction(handleLogin.failed, (state, action) => {
    return {
      ...state
    };
  })
  .caseWithAction(handleLogout, (state, action) => {
    return {
      ...state
    };
  })
  .default(state => ({ ...state }));
