<template>
  <el-container style="min-height: 100vh">
    <!-- 導航列 -->
    <el-header>
      <el-menu
        :default-active="$route.path"
        mode="horizontal"
        router
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/">首頁</el-menu-item>
        <el-menu-item index="/articles">文章管理</el-menu-item>
        <el-menu-item index="/articles/summary">文章摘要</el-menu-item>
      </el-menu>
    </el-header>

    <!-- 主內容 -->
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>
