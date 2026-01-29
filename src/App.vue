<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <div class="brand">
          <el-icon class="brand-icon"><Document /></el-icon>
          <span class="brand-name">Article Hub</span>
        </div>
        <el-menu
          :default-active="$route.path"
          mode="horizontal"
          router
          class="nav-menu"
          :ellipsis="false"
        >
          <el-menu-item index="/">首頁</el-menu-item>
          <el-menu-item index="/articles">文章管理</el-menu-item>
          <el-menu-item index="/articles/summary">文章摘要</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-main class="app-main">
      <div class="content-wrapper">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { Document } from '@element-plus/icons-vue'
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.app-header {
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  padding: 0 40px;
  height: 64px !important;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 24px;
  color: var(--primary-color);
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.nav-menu {
  border-bottom: none !important;
  background-color: transparent !important;
}

.nav-menu :deep(.el-menu-item) {
  height: 64px;
  font-weight: 500;
  color: var(--text-muted);
}

.nav-menu :deep(.el-menu-item.is-active) {
  color: var(--primary-color) !important;
  border-bottom: 2px solid var(--primary-color) !important;
}

.app-main {
  padding: 32px 20px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
