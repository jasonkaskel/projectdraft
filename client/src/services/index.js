import axios from 'axios'

import { API_HOST, API_URL } from '../constants'
import * as draft from './draft'
import * as login from './login'
export default {
  ...draft,
  ...login,
}

export const xhr = (method, url, { headers, params, data }={}) => {
  return axios.request({
    method: method,
    url: `${API_HOST}${API_URL}${url}`,
    headers: Object.assign({'Client-Access-Token': localStorage.getItem('Client-Access-Token')}, headers || {}),
    params,
    data,
  })
}
