import action from '../action';

import { APIError, LoginCreds, Token } from 'src/services/types';

export const handleLogin = action.async<LoginCreds, Token, APIError>('LOGIN');

export const handleLogout = action('LOGOUT');

export const initSession = action('INIT_SESSION');
