<script setup>
import { ref, onMounted, onUnmounted } from 'vue' // 引入生命週期勾子
import { ElMessage } from 'element-plus'
import { ChatLineSquare } from '@element-plus/icons-vue'
import { fetchSummary } from '@/api/summary' // 引入摘要 API
import { checkAndBackfill } from '@/api/article' // 引入補檔 API

// 1. 定義時間篩選相關變數
const startDate = ref('')
const endDate = ref('')
const startTime = ref('00:00:00')
const endTime = ref('23:59:59')

// 2. 定義資料與狀態變數
const articleList = ref([])      // 文章列表
const overallSummary = ref('')   // 整體摘要內容
const loading = ref(false)       // 載入狀態

// 3. 定義 Loading 動畫相關變數
const loadingDots = ref('')      // 動態點點字串
let loadingInterval = null       // 動畫計時器

/**
 * 啟動點點動畫：每 0.5 秒切換一次 . .. ...
 */
const startLoadingAnimation = () => {
  let count = 0
  loadingDots.value = ''
  loadingInterval = setInterval(() => {
    count = (count + 1) % 4
    loadingDots.value = '.'.repeat(count)
  }, 500)
}

/**
 * 停止點點動畫並清除計時器
 */
const stopLoadingAnimation = () => {
  if (loadingInterval) {
    clearInterval(loadingInterval)
    loadingInterval = null
    loadingDots.value = ''
  }
}

/**
 * 元件掛載時執行的邏輯
 */
onMounted(() => {
  console.log('正在檢查新聞資料完整性...') // 解決你之前沒印出的問題
  // 觸發後端檢查並補檔 (每日熱門新聞)
  checkAndBackfill()
    .then(() => {
      console.log('後端檢查任務已觸發 (若缺資料將自動補檔)')
    })
    .catch(err => {
      console.warn('觸發補檔任務失敗 (請確認 article.js 已更新 checkAndBackfill 方法)', err)
    })
})

/**
 * 元件卸載時清除計時器，防止記憶體洩漏
 */
onUnmounted(() => {
  stopLoadingAnimation()
})

/**
 * 輔助方法：建構時間範圍字串
 */
const buildRange = () => {
  if (!startDate.value || !endDate.value) return { startTime: null, endTime: null }
  return {
    startTime: `${startDate.value}T${startTime.value}`,
    endTime: `${endDate.value}T${endTime.value}`,
  }
}

/**
 * 核心方法：向後端請求摘要
 */
const handleFetchSummary = async () => {
  const { startTime, endTime } = buildRange()

  if (!startTime || !endTime) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  // 設定載入狀態並啟動動畫
  loading.value = true
  articleList.value = []
  overallSummary.value = ''
  startLoadingAnimation()

  try {
    // 呼叫後端 API (後端 GeminiService 會使用 gemini-2.5-flash 處理)
    const { data } = await fetchSummary({ startTime, endTime })
    
    if (data.success) {
      overallSummary.value = data.overallSummary
      articleList.value = data.articles
      ElMessage.success('摘要產生成功')
    } else {
      ElMessage.warning('未取得預期資料')
    }

  } catch (err) {
    console.error(err)
    ElMessage.error('摘要產生失敗，請稍後再試')
  } finally {
    // 停止動畫並解除載入狀態
    stopLoadingAnimation()
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <h2 class="section-title">文章 AI 摘要</h2>

    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-group">
          <span class="filter-label">開始時間</span>
          <div class="date-time-inputs">
            <el-date-picker v-model="startDate" type="date" value-format="YYYY-MM-DD" placeholder="開始日期" />
            <el-time-picker v-model="startTime" value-format="HH:mm:ss" placeholder="開始時間" />
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">結束時間</span>
          <div class="date-time-inputs">
            <el-date-picker v-model="endDate" type="date" value-format="YYYY-MM-DD" placeholder="結束日期" />
            <el-time-picker v-model="endTime" value-format="HH:mm:ss" placeholder="結束時間" />
          </div>
        </div>
        <div class="action-buttons">
          <el-button type="primary" size="large" @click="handleFetchSummary" :loading="loading">
            <el-icon class="el-icon--left"><ChatLineSquare /></el-icon> 產生摘要
          </el-button>
        </div>
      </div>
    </el-card>

    <div v-if="loading" class="loading-section">
      <el-card class="box-card" shadow="never">
        <div class="loading-container">
          <span class="loading-text">摘要生成中{{ loadingDots }}</span>
        </div>
      </el-card>
    </div>

    <div v-if="overallSummary" class="overall-summary-section">
      </div>

    <div v-if="overallSummary" class="overall-summary-section">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="summary-title">🤖 AI 重點新聞總評</span>
          </div>
        </template>
        <div class="summary-text-main" style="white-space: pre-wrap;">
          {{ overallSummary }}
        </div>
      </el-card>
    </div>

    <el-divider v-if="articleList.length > 0" content-position="center">原始新聞列表</el-divider>

    <div v-if="articleList.length > 0" class="summary-list">
      <el-row :gutter="20">
        <el-col v-for="item in articleList" :key="item.id" :xs="24" :sm="24" :md="12" :lg="12">
          <el-card class="summary-item-card" shadow="hover">
            <template #header>
              <div class="item-header">
                <span class="item-id">ID: {{ item.id }}</span>
              </div>
            </template>
            <div class="summary-content">
              <div class="title-section">
                <h4>{{ item.title }}</h4>
              </div>
              <div class="content-section">
                <label>簡介</label>
                <p>{{ item.description || item.content || '無內容' }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-else-if="!loading && !overallSummary" description="暫無資料，請調整時間範圍並查詢" />
  </div>
</template>

<style scoped>
.page-container { padding-bottom: 40px; }
.filter-card { margin-bottom: 20px; }
.filter-row { display: flex; flex-direction: column; gap: 20px; }
@media (min-width: 768px) { .filter-row { flex-direction: row; align-items: flex-end; } }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-label { font-size: 0.875rem; color: var(--text-muted); }
.date-time-inputs { display: flex; gap: 8px; }
.action-buttons { margin-top: 10px; }

/* 總評區塊樣式 */
.overall-summary-section { margin-bottom: 30px; }
.summary-title { font-weight: bold; font-size: 1.2rem; color: #409EFF; }
.summary-text-main { font-size: 1rem; line-height: 1.8; color: #2c3e50; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }

/* 列表樣式 */
.summary-item-card { margin-bottom: 20px; height: 100%; }
.item-header { display: flex; justify-content: space-between; }
.title-section h4 { margin: 0 0 10px 0; font-size: 1.1rem; color: #303133; }
.content-section p { color: #606266; font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

/* [新增] Loading 樣式 */
.loading-section {
  margin-bottom: 30px;
  text-align: center;
}

.loading-container {
  padding: 40px 0; /* 增加一點上下留白，讓畫面不擁擠 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  font-size: 2rem;       /* 字體比摘要(1rem)大兩倍 */
  font-weight: bold;     /* 加粗 */
  color: #409EFF;        /* 使用 Element Plus 的主色調 */
  letter-spacing: 2px;   /* 增加字距，看起來更有質感 */
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>