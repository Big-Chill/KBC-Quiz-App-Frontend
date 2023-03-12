import { getRequest, postRequest } from '../../Utils/api';
import {
  ALL_QUESTION,
  CATEGORY_QUESTION,
  DIFFICULTY_QUESTION,
  CATEGORY_DIFFICULTY_QUESTION,
  ADD_STAT
} from '../../Api/urls';

export const getAllQuestion = async (limit = undefined) => getRequest(`${ALL_QUESTION}?n=${limit}`);

export const getCategoryQuestion = async (category, limit = undefined) => getRequest(`${CATEGORY_QUESTION}/${category}?n=${limit}`);

export const getDifficultyQuestion = async (difficulty, limit = undefined) => getRequest(`${DIFFICULTY_QUESTION}/${difficulty}?n=${limit}`);

export const getCategoryDifficultyQuestion = async (category, difficulty, limit = undefined) => getRequest(`${CATEGORY_DIFFICULTY_QUESTION}/${category}/${difficulty}?n=${limit}`);

export const addStat = async (userId, data) => postRequest(`${ADD_STAT}/${userId}`, data);