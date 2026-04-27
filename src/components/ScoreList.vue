<template>
  <div class="score-list">
    <div class="list-header">
      <h2>
        {{ studentName ? studentName + ' 的成績' : '選擇學生查看成績' }}
      </h2>
      <span v-if="scores.length > 0" class="avg-badge">
        平均 {{ avgScore }} 分
      </span>
    </div>

    <div v-if="!studentName" class="hint-msg">
      👈 點左側學生查看其成績
    </div>

    <div v-else-if="loading" class="status-msg">⏳ 載入成績...</div>

    <div v-else-if="scores.length === 0" class="empty-msg">
      這位學生還沒有成績記錄
    </div>

    <div v-else class="score-table">
      <div class="table-head">
        <span>科目</span>
        <span>成績</span>
        <span>日期</span>
        <span>操作</span>
      </div>
      <div
        v-for="score in scores"
        :key="score.id"
        class="table-row"
      >
        <span class="subject">{{ score.subject }}</span>
        <!-- 編輯模式 / 顯示模式 切換 -->
        <span v-if="editingId !== score.id" class="score-value" :class="scoreClass(score.score)">
          {{ score.score }} 分
        </span>
        <input
          v-else
          v-model.number="editValue"
          type="number"
          class="score-input"
          min="0" max="100"
        />
        <span class="date">{{ score.date }}</span>
        <div class="row-actions">
          <!-- 非編輯狀態：顯示「編輯」按鈕 -->
          <template v-if="editingId !== score.id">
            <button class="btn-edit" @click="startEdit(score)">編輯</button>
          </template>
          <!-- 編輯狀態：顯示「儲存」和「取消」 -->
          <template v-else>
            <button class="btn-save" @click="$emit('update', score.id, editValue)">儲存</button>
            <button class="btn-cancel" @click="editingId = null">取消</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  scores:      { type: Array,  default: () => [] },
  studentName: { type: String, default: null },
  loading:     { type: Boolean, default: false },
})

defineEmits(['update'])

// 行內編輯狀態
const editingId = ref(null)
const editValue = ref(0)

function startEdit(score) {
  editingId.value = score.id
  editValue.value = score.score
}

// 計算平均分數
const avgScore = computed(() => {
  if (!props.scores.length) return 0
  const sum = props.scores.reduce((s, sc) => s + Number(sc.score), 0)
  return Math.round(sum / props.scores.length)
})

// 根據分數給不同的顏色 class
function scoreClass(score) {
  if (score >= 90) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}
</script>

<style scoped>
.score-list { background: white; border-radius: 12px; padding: 20px; }

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
h2 { font-size: 18px; color: #333; }
.avg-badge {
  font-size: 13px;
  background: #e8f4f0;
  color: #2e6b4f;
  padding: 3px 12px;
  border-radius: 99px;
  font-weight: 600;
}

.hint-msg   { color: #bbb; text-align: center; padding: 30px 0; font-size: 15px; }
.status-msg { color: #888; text-align: center; padding: 20px 0; }
.empty-msg  { color: #aaa; text-align: center; padding: 20px 0; font-size: 14px; }

/* 成績表格 */
.table-head, .table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr 1fr;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
}
.table-head {
  font-size: 12px;
  color: #999;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
}
.table-row {
  border-bottom: 1px solid #f8f8f8;
}
.table-row:last-child { border-bottom: none; }

.subject { font-weight: 500; color: #333; }
.date    { font-size: 13px; color: #999; }

/* 成績顏色 */
.score-value      { font-weight: 700; font-size: 15px; }
.score-excellent  { color: #2e6b4f; }
.score-good       { color: #1a5ea8; }
.score-pass       { color: #c9962a; }
.score-fail       { color: #c84b2f; }

/* 行內編輯輸入框 */
.score-input {
  width: 70px;
  padding: 4px 8px;
  border: 2px solid #2a7ae2;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.row-actions { display: flex; gap: 6px; }

.btn-edit   { padding: 3px 10px; background: #f0f0f0; color: #555; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; }
.btn-edit:hover { background: #e0e0e0; }
.btn-save   { padding: 3px 10px; background: #2e6b4f; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; }
.btn-cancel { padding: 3px 10px; background: #f0f0f0; color: #555; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; }
</style>
