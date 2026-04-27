<template>
  <div class="form-card">
    <h3>新增學生</h3>

    <div class="form-body">
      <div class="field">
        <label>姓名 <span class="required">*</span></label>
        <input v-model="form.name" placeholder="例：王小明" />
      </div>
      <div class="field">
        <label>班級 <span class="required">*</span></label>
        <input v-model="form.class" placeholder="例：三年一班" />
      </div>
      <div class="field">
        <label>Email</label>
        <input v-model="form.email" placeholder="例：ming@example.com" type="email" />
      </div>
    </div>

    <p v-if="errorMsg" class="error-msg">⚠️ {{ errorMsg }}</p>

    <div class="form-actions">
      <button
        class="btn-submit"
        @click="submit"
        :disabled="submitting"
      >
        {{ submitting ? '新增中...' : '＋ 新增學生' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['added'])

const form = reactive({
  name:  '',
  class: '',
  email: ''
})
const errorMsg  = ref('')
const submitting = ref(false)

async function submit() {
  // 驗證必填欄位
  errorMsg.value = ''
  if (!form.name.trim())  { errorMsg.value = '請填寫姓名'; return }
  if (!form.class.trim()) { errorMsg.value = '請填寫班級'; return }

  submitting.value = true
  // 通知父元件執行新增，把表單資料傳出去
  emit('added', { ...form })
}

// 讓父元件可以呼叫這個函式來重置表單
function reset() {
  form.name  = ''
  form.class = ''
  form.email = ''
  errorMsg.value   = ''
  submitting.value = false
}

// 把函式暴露給父元件使用
defineExpose({ reset })
</script>

<style scoped>
.form-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}
h3 { font-size: 16px; color: #333; margin-bottom: 16px; }

.form-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }

.field label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
  font-weight: 500;
}
.required { color: #c84b2f; }
.field input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
}
.field input:focus {
  outline: none;
  border-color: #2a7ae2;
}

.error-msg { color: #c84b2f; font-size: 13px; margin-bottom: 10px; }

.btn-submit {
  width: 100%;
  padding: 11px;
  background: #2a7ae2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-submit:hover:not(:disabled) { background: #1a5ea8; }
.btn-submit:disabled { background: #aaa; cursor: not-allowed; }
</style>
