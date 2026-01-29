<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { updateArticle } from '@/api/article'

const id = ref('')
const selectedField = ref('')
const newValue = ref('')
const result = ref(null)
const updating = ref(false)

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

const currentField = computed(() => fields.find((f) => f.value === selectedField.value))

const handleFieldChange = () => {
  newValue.value = currentField.value?.type === 'number' ? null : ''
}

const handleUpdate = async () => {
  if (!id.value || !selectedField.value || newValue.value === '' || newValue.value === null) {
    ElMessage.warning('請填寫完整資訊')
    return
  }

  updating.value = true
  try {
    const { data } = await updateArticle({
      id: id.value,
      fields: {
        [selectedField.value]: newValue.value,
      },
    })
    result.value = data
    if (data.success) {
      ElMessage.success(data.message)
    } else {
      ElMessage.error(data.message)
    }
  } catch (err) {
    ElMessage.error('連線錯誤，更新失敗')
  } finally {
    updating.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <h2 class="section-title">更新文章內容</h2>

    <el-card class="update-card" shadow="never">
      <el-form label-position="top" class="update-form">
        <el-form-item label="文章 ID" required>
          <el-input v-model="id" placeholder="例如: 12345678" clearable />
        </el-form-item>

        <el-form-item label="選取要更新的欄位" required>
          <el-select
            v-model="selectedField"
            placeholder="請選擇欄位"
            @change="handleFieldChange"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="field in fields"
              :key="field.value"
              :label="field.label"
              :value="field.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="selectedField" label="新的值" required>
          <!-- Radio (sentiment_tag) -->
          <el-radio-group v-if="selectedField === 'sentiment_tag'" v-model="newValue">
            <el-radio-button label="p">正面</el-radio-button>
            <el-radio-button label="n">負面</el-radio-button>
            <el-radio-button label="m">中立</el-radio-button>
          </el-radio-group>

          <!-- 數字輸入 (InputNumber) -->
          <el-input-number
            v-else-if="currentField?.type === 'number'"
            v-model="newValue"
            :min="0"
            controls-position="right"
            style="width: 100%"
          />

          <!-- 一般輸入框 -->
          <el-input
            v-else
            v-model="newValue"
            type="textarea"
            :rows="3"
            placeholder="請輸入內容..."
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-button type="primary" size="large" @click="handleUpdate" :loading="updating">
            確認並更新
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 更新結果 -->
    <transition name="el-fade-in">
      <el-card v-if="result" class="result-card" shadow="never">
        <template #header>
          <div class="result-header">
            <span>更新狀態回報</span>
            <el-tag :type="result.success ? 'success' : 'danger'" effect="dark">
              {{ result.success ? '成功' : '失敗' }}
            </el-tag>
          </div>
        </template>
        <pre class="result-body">{{ JSON.stringify(result, null, 2) }}</pre>
      </el-card>
    </transition>
  </div>
</template>

<style scoped>
.update-card {
  max-width: 600px;
  background: var(--card-bg);
}

.update-form {
  padding: 10px 0;
}

.form-actions {
  margin-top: 32px;
  margin-bottom: 0;
}

.form-actions :deep(.el-button) {
  width: 100%;
}

.result-card {
  margin-top: 24px;
  max-width: 600px;
  border-left: 4px solid var(--primary-color);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.result-body {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: var(--text-muted);
  background: #f8fafc;
  padding: 12px;
  border-radius: 4px;
}
</style>
