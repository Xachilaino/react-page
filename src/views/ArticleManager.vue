<script setup>
import ArticleSearchDelete from './ArticleSearchDelete.vue'
import ArticleUpdate from './ArticleUpdate.vue'
</script>

<template>
  <div class="page-container">
    <div class="manager-header">
      <h2 class="section-title">內容管理系統</h2>
      <p class="section-subtitle">查詢、刪除或更新系統中的文章資訊</p>
    </div>

    <el-tabs class="modern-tabs">
      <el-tab-pane label="瀏覽與操作">
        <ArticleSearchDelete />
      </el-tab-pane>
      <el-tab-pane label="更新資料">
        <ArticleUpdate />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.manager-header {
  margin-bottom: 24px;
}

.section-subtitle {
  color: var(--text-muted);
  margin-top: -16px;
  margin-bottom: 24px;
}

.modern-tabs :deep(.el-tabs__header) {
  margin-bottom: 32px;
}

.modern-tabs :deep(.el-tabs__item) {
  font-size: 1rem;
  font-weight: 500;
  height: 48px;
}

.modern-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
}
</style>
