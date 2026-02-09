import axios from "axios";

// 1. 設定基礎網址 (自動切換本地/雲端)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 2. 建立 axios 實例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 30000
});

const API_BASE = "/api/articles";

/**
 * 查詢文章
 * @param {Object} params - { startTime, endTime }
 */
export const queryArticles = (params) => {
  return request.post(`${API_BASE}/query`, params);
};

/**
 * 更新文章
 * @param {Object} params - { id, fields: { key: value } }
 */
export const updateArticle = (params) => {
  return request.post(`${API_BASE}/update`, params);
};

/**
 * 刪除文章
 * @param {Object} params - { startTime, endTime }
 */
export const deleteArticles = (params) => {
  return request.post(`${API_BASE}/delete`, params);
};

/**
 * [新增] 觸發後端檢查並補檔 (每日熱門新聞)
 * 呼叫 TaskController 的 /api/check-data
 */
export const checkAndBackfill = () => {
  // 注意：路徑是 /api/check-data，不是 /api/articles/...
  return request.post('/api/check-data');
};