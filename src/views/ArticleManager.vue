<script setup>
import ArticleSearchDelete from './ArticleSearchDelete.vue'
import ArticleUpdate from './ArticleUpdate.vue'
</script>

<template>
  <div>
    <h2>文章管理</h2>
    <el-tabs>
      <el-tab-pane label="查詢/刪除文章">
        <ArticleSearchDelete />
      </el-tab-pane>
      <el-tab-pane label="更新文章">
        <ArticleUpdate />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
