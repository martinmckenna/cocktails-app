import actionCreatorFactory from 'typescript-fsa';

import { APIError, LoginCreds, Token } from 'src/services/types';

const action = actionCreatorFactory('@@BARCARTDOTNET/');

export const handleLogin = action.async<LoginCreds, Token, APIError>('LOGIN');

export const handleLogout = action('LOGOUT');
