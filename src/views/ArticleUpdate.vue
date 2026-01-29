<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateArticle } from '@/api/article'

const id = ref('')
const selectedField = ref('')
const newValue = ref('')
const result = ref(null)

const fields = [
  { label: '標題', value: 'title' },
  { label: '內文', value: 'content' },
  { label: '網站名稱', value: 's_name' },
  { label: '頻道名稱', value: 's_area_name' },
  { label: '原始網址', value: 'page_url' },
  { label: '作者', value: 'author' },
  { label: '主文ID', value: 'main_id' },
  { label: '正面情緒分數', value: 'positive_percentage', type: 'number' },
  { label: '負面情緒分數', value: 'negative_percentage', type: 'number' },
  { label: '回文數', value: 'comment_count', type: 'number' },
  { label: '觀看數', value: 'view_count', type: 'number' },
  { label: '分享數', value: 'used_count', type: 'number' },
  { label: '文章類型', value: 'content_type' },
  { label: '情緒標籤', value: 'sentiment_tag', type: 'radio' },
  { label: '關鍵字命中次數', value: '_hit_num', type: 'number' },
  { label: '文章來源', value: 'article_type' },
]

// 切換欄位時，清空輸入
const handleFieldChange = () => {
  const field = fields.find((f) => f.value === selectedField.value)

  if (field && field.type === 'number') {
    newValue.value = null // ✅ 避免 el-input-number 報錯
  } else {
    newValue.value = ''
  }
}

const handleUpdate = async () => {
  if (!id.value || !selectedField.value || newValue.value === '' || newValue.value === null) {
    ElMessage.warning('請輸入完整資訊')
    return
  }

  try {
    const { data } = await updateArticle({
      id: id.value,
      fields: {
        [selectedField.value]: newValue.value,
      },
    })

    console.log('📝 更新 API Response:', data) // ✅ Debug
    result.value = data

    if (data.success) {
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.message)
    }
  } catch (err) {
    console.error('❌ 更新 API 呼叫失敗:', err)
    ElMessage.error('更新失敗')
  }
}
</script>

<template>
  <div>
    <!-- ID 輸入 -->
    <el-input v-model="id" placeholder="請輸入文章 ID" style="margin-bottom: 10px" />

    <!-- 選擇欄位 -->
    <el-select
      v-model="selectedField"
      placeholder="選擇要更新的欄位"
      style="margin-bottom: 10px; width: 100%"
      @change="handleFieldChange"
    >
      <el-option
        v-for="field in fields"
        :key="field.value"
        :label="field.label"
        :value="field.value"
      />
    </el-select>

    <!-- 動態輸入框 -->
    <div v-if="selectedField">
      <!-- Radio (sentiment_tag) -->
      <el-radio-group v-if="selectedField === 'sentiment_tag'" v-model="newValue">
        <el-radio label="p">正面</el-radio>
        <el-radio label="n">負面</el-radio>
        <el-radio label="m">中立</el-radio>
      </el-radio-group>

      <!-- 數字輸入 (InputNumber) -->
      <el-input-number
        v-else-if="fields.find((f) => f.value === selectedField && f.type === 'number')"
        v-model="newValue"
        :min="0"
        style="width: 100%"
      />

      <!-- 一般輸入框 -->
      <el-input v-else v-model="newValue" placeholder="請輸入新的值" />
    </div>

    <!-- 更新按鈕 -->
    <el-button type="primary" style="margin-top: 15px" @click="handleUpdate"> 更新 </el-button>

    <!-- 更新結果 (JSON 輸出) -->
    <div v-if="result" style="margin-top: 15px">
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>
