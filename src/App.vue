<template>
  <div class="app">
    <!-- 頂部標題列 -->
    <header class="app-header">
      <h1>📊 學生成績管理系統</h1>
      <div class="header-status">
        <span v-if="globalLoading" class="loading-dot">⏳</span>
        <span v-if="toastMsg" class="toast" :class="toastType">{{ toastMsg }}</span>
      </div>
    </header>

    <div class="layout">
      <!-- 左欄：學生名單 + 新增學生 -->
      <aside class="left-panel">
        <AddStudentForm
          ref="addStudentForm"
          @added="onAddStudent"
        />
        <StudentList
          :students="students"
          :loading="loadingStudents"
          :error="studentsError"
          :selectedId="selectedStudent?.id"
          @select="onSelectStudent"
          @delete="onDeleteStudent"
        />
      </aside>

      <!-- 右欄：成績列表 + 新增成績 -->
      <main class="right-panel">
        <AddScoreForm
          ref="addScoreForm"
          :selectedStudent="selectedStudent"
          @added="onAddScore"
        />
        <ScoreList
          :scores="scores"
          :studentName="selectedStudent?.name"
          :loading="loadingScores"
          @update="onUpdateScore"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 元件
import StudentList    from './components/StudentList.vue'
import ScoreList      from './components/ScoreList.vue'
import AddStudentForm from './components/AddStudentForm.vue'
import AddScoreForm   from './components/AddScoreForm.vue'

// API 函式
import {
  getStudents, addStudent, deleteStudent,
  getScores, addScore, updateScore
} from './api/sheets.js'

// ── 狀態 ──────────────────────────────────────────
const students       = ref([])
const scores         = ref([])
const selectedStudent = ref(null)

const loadingStudents = ref(false)
const loadingScores   = ref(false)
const studentsError   = ref(null)
const globalLoading   = ref(false)

// 通知訊息
const toastMsg  = ref('')
const toastType = ref('success')   // 'success' | 'error'

// 表單元件的 ref（用來呼叫 reset 方法）
const addStudentForm = ref(null)
const addScoreForm   = ref(null)

// ── 通知工具函式 ──────────────────────────────────
function showToast(msg, type = 'success') {
  toastMsg.value  = msg
  toastType.value = type
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

// ── 學生相關操作 ──────────────────────────────────

// 頁面載入時取得學生名單
async function loadStudents() {
  loadingStudents.value = true
  studentsError.value   = null
  try {
    students.value = await getStudents()
  } catch (e) {
    studentsError.value = '載入學生失敗：' + e.message
  } finally {
    loadingStudents.value = false
  }
}

// 點選學生：同時載入這位學生的成績
async function onSelectStudent(student) {
  selectedStudent.value = student
  loadingScores.value   = true
  try {
    scores.value = await getScores(student.id)
  } catch (e) {
    showToast('載入成績失敗：' + e.message, 'error')
  } finally {
    loadingScores.value = false
  }
}

// 新增學生
async function onAddStudent(formData) {
  globalLoading.value = true
  try {
    await addStudent(formData)
    await loadStudents()             // 重新載入學生名單
    addStudentForm.value?.reset()    // 清空表單
    showToast('✅ 學生新增成功！')
  } catch (e) {
    showToast('新增失敗：' + e.message, 'error')
    addStudentForm.value?.reset()    // 即使失敗也要重置 submitting 狀態
  } finally {
    globalLoading.value = false
  }
}

// 刪除學生
async function onDeleteStudent(id) {
  if (!confirm('確定要刪除這位學生嗎？')) return

  globalLoading.value = true
  try {
    await deleteStudent(id)
    await loadStudents()

    // 如果刪除的是目前選取的學生，清空右側成績
    if (selectedStudent.value?.id === id) {
      selectedStudent.value = null
      scores.value = []
    }
    showToast('✅ 學生已刪除')
  } catch (e) {
    showToast('刪除失敗：' + e.message, 'error')
  } finally {
    globalLoading.value = false
  }
}

// ── 成績相關操作 ──────────────────────────────────

// 新增成績
async function onAddScore(formData) {
  globalLoading.value = true
  try {
    await addScore(formData)
    // 重新載入這位學生的成績
    scores.value = await getScores(selectedStudent.value.id)
    addScoreForm.value?.reset()
    showToast('✅ 成績新增成功！')
  } catch (e) {
    showToast('新增失敗：' + e.message, 'error')
    addScoreForm.value?.reset()
  } finally {
    globalLoading.value = false
  }
}

// 更新成績
async function onUpdateScore(scoreId, newScore) {
  globalLoading.value = true
  try {
    await updateScore(scoreId, newScore)
    scores.value = await getScores(selectedStudent.value.id)
    showToast('✅ 成績更新成功！')
  } catch (e) {
    showToast('更新失敗：' + e.message, 'error')
  } finally {
    globalLoading.value = false
  }
}

// 頁面載入時執行
onMounted(() => {
  loadStudents()
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #f0f4f8; min-height: 100vh; }
</style>

<style scoped>
.app { max-width: 1100px; margin: 0 auto; padding: 20px; }

/* 頂部標題 */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
h1 { font-size: 22px; color: #2a1f14; }

/* 通知 Toast */
.toast {
  font-size: 14px;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 500;
}
.toast.success { background: #d4edd9; color: #2e6b4f; }
.toast.error   { background: #fde8e8; color: #c84b2f; }
.loading-dot   { font-size: 18px; }

/* 兩欄佈局 */
.layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  align-items: start;
}

/* 左右欄各自的間距 */
.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 手機版改單欄 */
@media (max-width: 700px) {
  .layout { grid-template-columns: 1fr; }
}
</style>
