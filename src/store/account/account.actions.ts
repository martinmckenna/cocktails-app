import { Account, APIError } from 'src/services/types';
import action from '../action';

export const getAccount = action.async<{}, Account, APIError>('ACCOUNT');
