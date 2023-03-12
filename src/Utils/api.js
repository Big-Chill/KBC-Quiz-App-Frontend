import axios from 'axios';


const axiosClient = axios.create();


axiosClient.defaults.baseURL = 'https://wide-eyed-pike-wig.cyclic.app/api/';
// axiosClient.defaults.baseURL = 'http://localhost:3001/api/';

axiosClient.defaults.headers.common = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

axiosClient.interceptors.request.use(
  async (config) => {
    const localStorageData = localStorage.getItem('quizUser') || '';
    if (localStorageData) {
      const { token } = JSON.parse(localStorageData);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function getRequest(URL) {
  return axiosClient.get(`/${URL}`).then(response => response);
}

export function postRequest(URL, payload) {
  return axiosClient.post(`/${URL}`, payload).then(response => response);
}

export function putRequest(URL, payload) {
  return axiosClient.put(`/${URL}`, payload).then(response => response);
}

export function deleteRequest(URL, payload) {
  return axiosClient.delete(`/${URL}`, payload).then(response => response);
}


