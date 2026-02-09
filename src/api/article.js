import axios from "axios";

// 1. 設定基礎網址
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 2. 建立實例 (CRUD 操作通常比較快，設 30秒 即可，但也可用預設)
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 120000
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