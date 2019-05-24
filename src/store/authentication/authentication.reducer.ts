import { APIError } from 'src/services/types';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { handleLogin, handleLogout } from './authentication.actions';

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

const reducer = reducerWithInitialState(initialState)
  .case(handleLogin.started, state => {
    return {
      ...state,
      isLoggingIn: true
    };
  })
  .caseWithAction(handleLogin.done, (state, action) => {
    return {
      ...state,
      isLoggingIn: false,
      token: action.payload.result
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
    return {
      ...state,
      token: '',
      isLoggingIn: false
    };
  })
  .default(state => ({ ...state }));

export default reducer;
