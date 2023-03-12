import { postRequest } from '../../Utils/api';
import { LOGIN, SIGNUP } from '../../Api/urls';

export const userLogin = async (payload) => postRequest(`${LOGIN}`, payload);
export const userSignup = async (payload) => postRequest(`${SIGNUP}`, payload);