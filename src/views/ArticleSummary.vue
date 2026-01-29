<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, ChatLineSquare } from '@element-plus/icons-vue'
import { fetchSummary } from '@/api/summary'

const startDate = ref('')
const endDate = ref('')
const startTime = ref('00:00:00')
const endTime = ref('23:59:59')
const summaries = ref([])
const loading = ref(false)

const buildRange = () => {
  if (!startDate.value || !endDate.value) return { startTime: null, endTime: null }
  return {
    startTime: `${startDate.value}T${startTime.value}`,
    endTime: `${endDate.value}T${endTime.value}`,
  }
}

const handleFetchSummary = async () => {
  const { startTime, endTime } = buildRange()

  if (!startTime || !endTime) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  loading.value = true
  try {
    const { data } = await fetchSummary({ startTime, endTime })
    summaries.value = data
    ElMessage.success('摘要產生成功')
  } catch (err) {
    ElMessage.error('摘要產生失敗，請稍後再試')
  } finally {
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
            <el-date-picker
              v-model="startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="開始日期"
            />
            <el-time-picker v-model="startTime" value-format="HH:mm:ss" placeholder="開始時間" />
          </div>
        </div>

        <div class="filter-group">
          <span class="filter-label">結束時間</span>
          <div class="date-time-inputs">
            <el-date-picker
              v-model="endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="結束日期"
            />
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

    <div v-if="summaries.length > 0" class="summary-list">
      <el-row :gutter="20">
        <el-col v-for="item in summaries" :key="item.id" :xs="24" :sm="24" :md="12" :lg="12">
          <el-card class="summary-item-card" shadow="hover">
            <template #header>
              <div class="item-header">
                <span class="item-id">ID: {{ item.id }}</span>
                <el-tag size="small" :type="item.limitInfo ? 'warning' : 'success'">
                  {{ item.limitInfo || '正常' }}
                </el-tag>
              </div>
            </template>
            <div class="summary-content">
              <div class="content-section">
                <label>原文內容</label>
                <p>{{ item.content }}</p>
              </div>
              <el-divider dashed />
              <div class="summary-section">
                <label>AI 摘要</label>
                <div class="summary-text">{{ item.summary }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-else description="暫無摘要資料，請調整時間範圍並查詢" />
  </div>
</template>

<style scoped>
.page-container {
  padding-bottom: 40px;
}

.filter-card {
  margin-bottom: 32px;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .filter-row {
    flex-direction: row;
    align-items: flex-end;
  }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
}

.date-time-inputs {
  display: flex;
  gap: 8px;
}

.action-buttons {
  margin-top: 10px;
}

.summary-item-card {
  margin-bottom: 20px;
  height: 100%;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-id {
  font-weight: 600;
  color: var(--text-main);
}

.summary-content label {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--primary-color);
  margin-bottom: 8px;
  font-weight: 700;
}

.content-section p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.summary-text {
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.95rem;
  line-height: 1.6;
  border-left: 3px solid var(--primary-color);
}
</style>
