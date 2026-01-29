<template>
  <div class="home-container">
    <div class="hero-section">
      <h1 class="hero-title">歡迎使用 Article Hub</h1>
      <p class="hero-subtitle">專業的文章管理與 AI 摘要分析平台</p>
      
      <div class="feature-grid">
        <el-card class="feature-card" @click="$router.push('/articles')">
          <el-icon class="feature-icon"><Search /></el-icon>
          <h3>快速查詢</h3>
          <p>強大的過濾功能，精準定位您需要的內容。</p>
        </el-card>

        <el-card class="feature-card" @click="$router.push('/articles/summary')">
          <el-icon class="feature-icon"><ChatLineSquare /></el-icon>
          <h3>AI 摘要</h3>
          <p>利用進階 AI 技術，為海量文章生成高品質摘要。</p>
        </el-card>

        <el-card class="feature-card" @click="$router.push('/articles')">
          <el-icon class="feature-icon"><Edit /></el-icon>
          <h3>即時更新</h3>
          <p>便捷的介面，隨時微調文章細節與情緒標籤。</p>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, ChatLineSquare, Edit } from '@element-plus/icons-vue'
</script>

<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.hero-section {
  text-align: center;
  max-width: 900px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 48px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  padding: 32px 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--primary-color);
}

.feature-icon {
  font-size: 40px;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.feature-card h3 {
  margin: 0 0 12px 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>
