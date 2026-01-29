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

const buildRange = () => {
  if (!startDate.value || !endDate.value) return { start: null, end: null }
  return {
    startTime: `${startDate.value}T${startTime.value}`,
    endTime: `${endDate.value}T${endTime.value}`,
  }
}

const handleFetchSummary = async () => {
  console.log('⚡ handleFetchSummary 被觸發') // ✅ Debug
  ElMessage.success('⚡ Debug: handleFetchSummary 觸發成功')

  const { startTime, endTime } = buildRange()
  console.log('📌 準備發送 API 參數:', { startTime, endTime }) // ✅ Debug

  if (!startTime || !endTime) {
    ElMessage.warning('請選擇完整的時間範圍')
    return
  }

  try {
    const { data } = await fetchSummary({ startTime, endTime })
    console.log('✅ API 回應:', data) // ✅ Debug
    ElMessage.success('✅ Debug: API 請求已送出，請查看 console.log')
    summaries.value = data
  } catch (err) {
    console.error('❌ API 呼叫失敗:', err) // ✅ Debug
    ElMessage.error('❌ Debug: API 呼叫失敗，請查看 console.log')
  }
}
</script>

<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-date-picker
        v-model="startDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="開始日期"
      />
      <el-time-picker v-model="startTime" value-format="HH:mm:ss" placeholder="開始時間" />
      <el-date-picker
        v-model="endDate"
        type="date"
        value-format="YYYY-MM-DD"
        placeholder="結束日期"
      />
      <el-time-picker v-model="endTime" value-format="HH:mm:ss" placeholder="結束時間" />

      <el-button type="primary" @click="handleFetchSummary">
        <el-icon><ChatLineSquare /></el-icon> 產生摘要
      </el-button>
    </div>

    <el-table :data="summaries" style="margin-top: 20px" row-key="id">
      <el-table-column prop="id" label="ID" width="120" />
      <el-table-column prop="content" label="內文" />
      <el-table-column prop="summary" label="摘要" />
      <el-table-column prop="limitInfo" label="狀態" width="120" />
    </el-table>
  </div>
</template>
