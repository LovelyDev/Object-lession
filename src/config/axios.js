import axios from 'axios'
import { API_URL } from './env';

const instance = axios.create({
    baseURL: `${API_URL}`,
});

instance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('Token');
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete instance.defaults.headers.common.Authorization;
      }
      return config;
    },
  
    error => Promise.reject(error)
);

export default {
    getData: (url, params) => 
    instance({
        'method':'GET',
        'url':url,
        'params': params,
    })
    ,
    postData: (url, data) =>
    instance({
        'method': 'POST',
        'url':url,
        'data': data,
    }),
    putData: (url, data) =>
    instance({
        'method': 'PUT',
        'url':url,
        'data': data,
    }),
    deleteData: (url) =>
    instance({
        'method': 'DELETE',
        'url':url,
    })
}
