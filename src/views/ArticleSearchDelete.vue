<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Filter, Delete, Document } from '@element-plus/icons-vue'
import { queryArticles, deleteArticles } from '@/api/article'
import { formatDateTime } from '@/utils/dateFormatter'

const startDate = ref('')
const endDate = ref('')
const startTime = ref('00:00:00') // 預設 00:00:00
const endTime = ref('00:00:00') // 預設 00:00:00
const articles = ref([])

// Drawer 狀態
const drawerVisible = ref(false)
const selectedRow = ref(null)

// 組合成 LocalDateTime 格式
const buildRange = () => {
  if (!startDate.value || !endDate.value || !startTime.value || !endTime.value) {
    return { start: null, end: null }
  }
  return {
    start: `${startDate.value}T${startTime.value}`,
    end: `${endDate.value}T${endTime.value}`,
  }
}

const handleQuery = async () => {
  const { start, end } = buildRange()
  if (!start || !end) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  const { data } = await queryArticles({ startTime: start, endTime: end })
  console.log('📌 查詢 API Response:', data) // ✅ Debug 印出完整 JSON

  if (data.success) {
    articles.value = data.articles
  } else {
    ElMessage.error(data.message)
    articles.value = []
  }
}

const handleDelete = async () => {
  const { start, end } = buildRange()
  if (!start || !end) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  const { data } = await deleteArticles({ startTime: start, endTime: end })
  console.log('🗑️ 刪除 API Response:', data) // ✅ Debug 印出完整 JSON

  if (data.success) {
    ElMessage.success(`刪除了 ${data.deletedCount} 篇文章`)
    articles.value = []
  } else {
    ElMessage.error(data.message)
  }
}

const openDrawer = (row) => {
  selectedRow.value = row
  drawerVisible.value = true
}
</script>

<template>
  <div class="page-container">
    <h2 class="section-title">文章查詢與管理</h2>

    <!-- 篩選卡片 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <div class="filter-group">
          <span class="filter-label">開始時間</span>
          <el-date-picker
            v-model="startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="開始日期"
            class="filter-item"
          />
          <el-time-picker
            v-model="startTime"
            value-format="HH:mm:ss"
            placeholder="開始時間"
            class="filter-item"
          />
        </div>

        <div class="filter-group">
          <span class="filter-label">結束時間</span>
          <el-date-picker
            v-model="endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="結束日期"
            class="filter-item"
          />
          <el-time-picker
            v-model="endTime"
            value-format="HH:mm:ss"
            placeholder="結束時間"
            class="filter-item"
          />
        </div>

        <div class="action-buttons">
          <el-button type="primary" :icon="Filter" @click="handleQuery"> 查詢 </el-button>
          <el-button type="danger" plain :icon="Delete" @click="handleDelete"> 刪除 </el-button>
        </div>
      </div>
    </el-card>

    <!-- 查詢結果表格 -->
    <el-card class="table-card" shadow="never">
      <el-table :data="articles" row-key="id" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="title" label="文章標題" min-width="250" show-overflow-tooltip />
        <el-table-column prop="sName" label="來源網站" width="150" />
        <el-table-column prop="postTime" label="發文時間" width="180">
          <template #default="scope">
            <span class="time-text">{{ formatDateTime(scope.row.postTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sentimentTag" label="情緒" width="100">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.sentimentTag)" size="small" effect="light">
              {{ scope.row.sentimentTag }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
            <el-button circle size="small" @click="openDrawer(scope.row)" :icon="Document" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- JSON 詳情 Drawer -->
    <el-drawer v-model="drawerVisible" title="文章詳細資訊" size="45%" border-radius="12px">
      <div v-if="selectedRow" class="json-container">
        <div class="detail-header">
          <h3>{{ selectedRow.title }}</h3>
          <p class="detail-meta">ID: {{ selectedRow.id }} | 來源: {{ selectedRow.sName }}</p>
        </div>
        <el-divider />
        <pre class="pretty-json">{{ JSON.stringify(selectedRow, null, 2) }}</pre>
      </div>
    </el-drawer>
  </div>
</template>

<style scoped>
.page-container {
  padding: 0 0 40px 0;
}

.filter-card {
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-end;
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

.filter-item {
  width: 180px !important;
}

.action-buttons {
  margin-left: auto;
  display: flex;
  gap: 12px;
}

.table-card {
  border: none;
}

.time-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.json-container {
  padding: 0 24px 24px 24px;
}

.detail-header h3 {
  margin: 0;
  color: var(--text-main);
  font-size: 1.25rem;
}

.detail-meta {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-top: 4px;
}

.pretty-json {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  color: #334155;
  border: 1px solid var(--border-color);
}
</style>
