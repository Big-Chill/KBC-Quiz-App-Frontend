import { getRequest } from '../../Utils/api';
import {
  ALL_CATEGORY,
  ALL_DIFFICULTY,
} from '../../Api/urls';

export const getAllCategory = async () => getRequest(`${ALL_CATEGORY}`);
export const getAllDifficulty = async () => getRequest(`${ALL_DIFFICULTY}`);
