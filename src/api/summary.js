import axios from 'axios'

// 自動判斷：如果有設定環境變數 (Vercel) 就用變數，否則用 localhost
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 建立專用的 axios 實例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 120000 // 設定 120 秒 (2分鐘)，避免 AI 還在跑前端就報錯斷線
})

export function fetchSummary(params) {
  // 注意：這裡只要寫後半段路徑，因為 baseURL 已經設定好了
  return request.post('/api/summary', params)
}