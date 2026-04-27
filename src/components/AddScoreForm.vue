<template>
  <div class="form-card">
    <h3>新增成績</h3>

    <p v-if="!selectedStudent" class="no-student">請先點選左側的學生</p>

    <div v-else>
      <p class="selected-hint">正在新增：<strong>{{ selectedStudent.name }}</strong> 的成績</p>

      <div class="form-body">
        <div class="field">
          <label>科目 <span class="required">*</span></label>
          <select v-model="form.subject">
            <option value="">選擇科目</option>
            <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="field">
          <label>成績 <span class="required">*</span>（0 ~ 100）</label>
          <input v-model.number="form.score" type="number" min="0" max="100" placeholder="輸入分數" />
        </div>
        <div class="field">
          <label>日期</label>
          <input v-model="form.date" type="date" />
        </div>
      </div>

      <p v-if="errorMsg" class="error-msg">⚠️ {{ errorMsg }}</p>

      <button
        class="btn-submit"
        @click="submit"
        :disabled="submitting"
      >
        {{ submitting ? '新增中...' : '＋ 新增成績' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const props = defineProps({
  selectedStudent: { type: Object, default: null }
})

const emit = defineEmits(['added'])

const subjects = ['國文', '英文', '數學', '自然', '社會', '物理', '化學', '生物']

const form = reactive({
  subject: '',
  score:   '',
  date:    new Date().toISOString().split('T')[0]   // 預設今天
})
const errorMsg   = ref('')
const submitting = ref(false)

async function submit() {
  errorMsg.value = ''
  if (!form.subject)                           { errorMsg.value = '請選擇科目'; return }
  if (form.score === '' || form.score < 0 || form.score > 100) {
    errorMsg.value = '請輸入 0 到 100 之間的分數'; return
  }

  submitting.value = true
  emit('added', {
    student_id: props.selectedStudent.id,
    subject:    form.subject,
    score:      form.score,
    date:       form.date,
  })
}

function reset() {
  form.subject = ''
  form.score   = ''
  form.date    = new Date().toISOString().split('T')[0]
  errorMsg.value   = ''
  submitting.value = false
}

defineExpose({ reset })
</script>

<style scoped>
.form-card { background: white; border-radius: 12px; padding: 20px; }
h3 { font-size: 16px; color: #333; margin-bottom: 16px; }

.no-student    { color: #aaa; text-align: center; padding: 16px 0; font-size: 14px; }
.selected-hint { font-size: 14px; color: #555; margin-bottom: 14px; background: #f0f6ff; padding: 8px 12px; border-radius: 6px; }

.form-body { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }
.field label { display: block; font-size: 13px; color: #666; margin-bottom: 5px; font-weight: 500; }
.required { color: #c84b2f; }
.field input, .field select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}
.field input:focus, .field select:focus { outline: none; border-color: #2a7ae2; }

.error-msg { color: #c84b2f; font-size: 13px; margin-bottom: 10px; }

.btn-submit {
  width: 100%;
  padding: 11px;
  background: #2e6b4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-submit:hover:not(:disabled) { background: #1e4f38; }
.btn-submit:disabled { background: #aaa; cursor: not-allowed; }
</style>
