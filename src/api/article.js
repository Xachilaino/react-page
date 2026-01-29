import axios from "axios";

const API_BASE = "/api/articles";

/**
 * 查詢文章
 * @param {Object} params - { startTime, endTime }
 */
export const queryArticles = (params) => {
  return axios.post(`${API_BASE}/query`, params);
};

/**
 * 更新文章
 * @param {Object} params - { id, fields: { key: value } }
 */
export const updateArticle = (params) => {
  return axios.post(`${API_BASE}/update`, params);
};

/**
 * 刪除文章
 * @param {Object} params - { startTime, endTime }
 */
export const deleteArticles = (params) => {
  return axios.post(`${API_BASE}/delete`, params);
};
