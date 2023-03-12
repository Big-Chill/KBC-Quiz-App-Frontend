import { getRequest, postRequest } from '../../Utils/api';
import {
  ALL_CATEGORY,
  ALL_DIFFICULTY,
  ADD_CATEGORY,
  ADD_DIFFICULTY,
  ADD_QUESTION
} from '../../Api/urls';

export const getAllCategory = async () => getRequest(`${ALL_CATEGORY}`);
export const getAllDifficulty = async () => getRequest(`${ALL_DIFFICULTY}`);
export const addCategory = async (data) => postRequest(`${ADD_CATEGORY}`, data);
export const addDifficulty = async (data) => postRequest(`${ADD_DIFFICULTY}`, data);
export const addQuestion = async (data) => postRequest(`${ADD_QUESTION}`, data);