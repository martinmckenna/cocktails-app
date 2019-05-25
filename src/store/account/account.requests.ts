import { getAccount as _getAccount } from 'src/services/account';
import { Account, APIError } from 'src/services/types';
import { ThunkAction } from '../index';
import { getAccount as getAccountAction } from './account.actions';

export const getAccount = (): ThunkAction<Account | APIError> => dispatch => {
  dispatch(getAccountAction.started({}));

  return _getAccount()
    .then(response => {
      dispatch(
        getAccountAction.done({
          result: response,
          params: {}
        })
      );
      return response;
    })
    .catch((e: APIError) => {
      dispatch(
        getAccountAction.failed({
          error: e,
          params: {}
        })
      );
      return e;
    });
};
