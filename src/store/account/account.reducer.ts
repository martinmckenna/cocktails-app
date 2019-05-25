import { Account, APIError } from 'src/services/types';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { getAccount } from './account.actions';

export interface State {
  accountLoading: boolean;
  accountError?: APIError;
  account?: Account;
}

export const initialState: State = {
  accountLoading: true
};

const reducer = reducerWithInitialState(initialState)
  .case(getAccount.started, state => {
    return {
      ...state,
      accountLoading: true,
      accountError: undefined
    };
  })
  .caseWithAction(getAccount.done, (state, action) => {
    return {
      ...state,
      accountLoading: false,
      account: action.payload.result
    };
  })
  .caseWithAction(getAccount.failed, (state, action) => {
    return {
      ...state,
      accountLoading: false,
      accountError: action.payload.error,
      account: undefined
    };
  })
  .default(state => ({ ...state }));

export default reducer;
