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
  <div>
    <!-- 日期與時間選擇 -->
    <div style="margin-bottom: 10px">
      <el-date-picker
        v-model="startDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="開始日期"
        style="margin-right: 10px"
      />
      <el-time-picker
        v-model="startTime"
        value-format="HH:mm:ss"
        placeholder="開始時間"
        style="margin-right: 20px"
      />

      <el-date-picker
        v-model="endDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="結束日期"
        style="margin-right: 10px"
      />
      <el-time-picker
        v-model="endTime"
        value-format="HH:mm:ss"
        placeholder="結束時間"
        style="margin-right: 20px"
      />

      <!-- 查詢與刪除按鈕 -->
      <el-button type="primary" @click="handleQuery">
        <el-icon><Filter /></el-icon> 查詢
      </el-button>
      <el-button type="danger" @click="handleDelete">
        <el-icon><Delete /></el-icon> 刪除
      </el-button>
    </div>

    <!-- 查詢結果表格 -->
    <el-table :data="articles" style="margin-top: 20px" row-key="id">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="title" label="標題" />
      <el-table-column prop="sName" label="網站名稱" width="150" />
      <el-table-column prop="postTime" label="發文時間">
        <template #default="scope">
          {{ formatDateTime(scope.row.postTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="sentimentTag" label="情緒" width="80" />

      <el-table-column label="詳情" width="120">
        <template #default="scope">
          <el-button size="small" @click="openDrawer(scope.row)">
            <el-icon><Document /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- JSON 詳情 Drawer -->
    <el-drawer v-model="drawerVisible" title="文章詳細資訊" size="40%">
      <pre v-if="selectedRow">{{ JSON.stringify(selectedRow, null, 2) }}</pre>
    </el-drawer>
  </div>
</template>
