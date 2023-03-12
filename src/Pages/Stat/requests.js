import { getRequest } from '../../Utils/api';
import {
  ALL_CATEGORY,
  ALL_DIFFICULTY,
  ALL_STAT,
  GET_STAT,
  CATEGORY_STAT,
  DIFFICULTY_STAT,
  CATEGORY_DIFFICULTY_STAT,
  TOP_N_DIFFICULTY_STAT,
  TOP_N_CATEGORY_STAT,
  TOP_N_CATEGORY_DIFFICULTY_STAT,
  TOP_N_STAT,
} from '../../Api/urls';

export const getAllCategory = async () => getRequest(`${ALL_CATEGORY}`);

export const getAllDifficulty = async () => getRequest(`${ALL_DIFFICULTY}`);

export const getAllStat = async () => getRequest(`${ALL_STAT}`);

export const getStat = async (id) => getRequest(`${GET_STAT}/${id}`);

export const getCategoryStat = async (id, category) => getRequest(`${CATEGORY_STAT}/${id}/${category}`);

export const getDifficultyStat = async (id, difficulty) => getRequest(`${DIFFICULTY_STAT}/${id}/${difficulty}`);

export const getCategoryDifficultyStat = async (id, category, difficulty) => getRequest(`${CATEGORY_DIFFICULTY_STAT}/${id}/${category}/${difficulty}`);

export const getTopNDifficultyStat = async (id, difficulty, n) => getRequest(`${TOP_N_DIFFICULTY_STAT}/${id}/${difficulty}/${n}`);

export const getTopNCategoryStat = async (id, category, n) => getRequest(`${TOP_N_CATEGORY_STAT}/${id}/${category}/${n}`);

export const getTopNCategoryDifficultyStat = async (id, category, difficulty, n) => getRequest(`${TOP_N_CATEGORY_DIFFICULTY_STAT}/${id}/${category}/${difficulty}/${n}`);

export const getTopNStat = async (id, n) => getRequest(`${TOP_N_STAT}/${id}/${n}`);
