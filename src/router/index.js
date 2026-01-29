import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import ArticleManager from '@/views/ArticleManager.vue'
import ArticleSearchDelete from '@/views/ArticleSearchDelete.vue'
import ArticleUpdate from '@/views/ArticleUpdate.vue'
import ArticleSummary from '@/views/ArticleSummary.vue' // ✅ 新增

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/articles', name: 'ArticleManager', component: ArticleManager },
  { path: '/articles/search-delete', name: 'ArticleSearchDelete', component: ArticleSearchDelete },
  { path: '/articles/update', name: 'ArticleUpdate', component: ArticleUpdate },
  { path: '/articles/summary', name: 'ArticleSummary', component: ArticleSummary }, // ✅ 新增
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
