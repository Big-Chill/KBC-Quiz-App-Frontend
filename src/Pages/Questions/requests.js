import { getRequest, putRequest, deleteRequest } from '../../Utils/api';
import {
  ALL_QUESTION_PAGINATED,
  ALL_QUESTION_COUNT,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  ALL_CATEGORY,
  ALL_DIFFICULTY,
} from '../../Api/urls';

export const getAllCategory = async () => getRequest(`${ALL_CATEGORY}`);

export const getAllDifficulty = async () => getRequest(`${ALL_DIFFICULTY}`);

export const getQuestionsCount = async () => getRequest(ALL_QUESTION_COUNT);

export const getQuestions = async (page, limit) => getRequest(`${ALL_QUESTION_PAGINATED}?page=${page}&limit=${limit}`);

export const updateQuestion = async (questionId, payload) => putRequest(`${UPDATE_QUESTION}/${questionId}`, payload);

export const deleteQuestion = async (questionId) => deleteRequest(`${DELETE_QUESTION}/${questionId}`);