import actionCreatorFactory from 'typescript-fsa';

import { APIError, LoginCreds } from 'src/services/types';

const action = actionCreatorFactory('@@BARCARTDOTNET/');

export const handleLogin = action.async<LoginCreds, string, APIError>('LOGIN');

export const handleLogout = action('LOGOUT');
