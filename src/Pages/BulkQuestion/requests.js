import { postRequest } from '../../Utils/api';
import {
  ADD_BULK_QUESTION
} from '../../Api/urls';

export const addBulkQuestion = async (data) => postRequest(`${ADD_BULK_QUESTION}`, data);