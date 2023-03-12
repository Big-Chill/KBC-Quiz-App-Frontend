import { getRequest, postRequest, putRequest } from '../../Utils/api';
import {
  GET_PROFILE,
  ADD_PROFILE,
  UPDATE_PROFILE,
  IS_PROFILE_PRESENT
} from '../../Api/urls';

export const getProfile = async (userId) => getRequest(`${GET_PROFILE}?userId=${userId}`);

export const isProfilePresent = async (email) => getRequest(`${IS_PROFILE_PRESENT}?email=${email}`);

export const addProfile = async (profile) => postRequest(ADD_PROFILE, profile);

export const updateProfile = async (profile, userId) => putRequest(`${UPDATE_PROFILE}?userId=${userId}`, profile);

