import { login } from 'src/services/authentication';
import { APIError } from 'src/services/types';
import { ThunkAction } from '../index';
import { handleLogin as _handleLogin } from './authentication.actions';

export const handleLogin = (
  username: string,
  password: string
): ThunkAction<string | APIError> => dispatch => {
  dispatch(
    _handleLogin.started({
      username,
      password
    })
  );

  return login(username, password)
    .then(response => {
      dispatch(
        _handleLogin.done({
          result: response,
          params: {
            username,
            password
          }
        })
      );
      return response;
    })
    .catch((e: APIError) => {
      dispatch(
        _handleLogin.failed({
          params: {
            username,
            password
          },
          error: e
        })
      );
      return Promise.reject(e);
    });
};
