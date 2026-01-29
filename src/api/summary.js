import axios from 'axios'

export function fetchSummary(params) {
  return axios.post('/api/summary', params)
}
