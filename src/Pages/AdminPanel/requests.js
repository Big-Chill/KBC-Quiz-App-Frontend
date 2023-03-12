import { getRequest, postRequest, deleteRequest, putRequest } from '../../Utils/api';
import { ALL_USER, ADD_ADMIN, DELETE_ADMIN, GET_USER_ID, DELETE_USER, CHANGE_PASSWORD } from '../../Api/urls';

export const getAllUser = async () => getRequest(`${ALL_USER}`);

export const addAdmin = async (data) => postRequest(`${ADD_ADMIN}`, data);

export const deleteAdmin = async (data) => deleteRequest(`${DELETE_ADMIN}`, data);

export const getUserId = async (email) => getRequest(`${GET_USER_ID}?email=${email}`);

export const deleteUser = async (email) => deleteRequest(`${DELETE_USER}/${email}`);

export const changePassword = async (email, password, confirmPassword) => putRequest(`${CHANGE_PASSWORD}/${email}`, { password: password, confirmPassword: confirmPassword });