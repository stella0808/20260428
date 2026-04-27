<template>
  <div class="student-list">
    <div class="list-header">
      <h2>學生名單</h2>
      <span class="count">共 {{ students.length }} 人</span>
    </div>

    <!-- 載入中 -->
    <div v-if="loading" class="status-msg">⏳ 載入中...</div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="error-msg">❌ {{ error }}</div>

    <!-- 學生列表 -->
    <div v-else>
      <p v-if="students.length === 0" class="empty-msg">還沒有學生資料</p>

      <div
        v-for="student in students"
        :key="student.id"
        class="student-row"
        :class="{ selected: selectedId === student.id }"
        @click="$emit('select', student)"
      >
        <div class="student-info">
          <span class="student-name">{{ student.name }}</span>
          <span class="student-class">{{ student.class }}</span>
        </div>
        <div class="student-actions">
          <span class="student-email">{{ student.email }}</span>
          <button class="btn-delete" @click.stop="$emit('delete', student.id)">
            刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  students:   { type: Array,   default: () => [] },
  loading:    { type: Boolean, default: false },
  error:      { type: String,  default: null },
  selectedId: { type: Number,  default: null },
})

defineEmits(['select', 'delete'])
</script>

<style scoped>
.student-list { background: white; border-radius: 12px; padding: 20px; }

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
h2    { font-size: 18px; color: #333; }
.count { font-size: 13px; color: #888; background: #f0f0f0; padding: 3px 10px; border-radius: 99px; }

.status-msg { color: #888; text-align: center; padding: 20px 0; }
.error-msg  { color: #c84b2f; background: #fff3f0; border-radius: 8px; padding: 12px; font-size: 14px; }
.empty-msg  { color: #aaa; text-align: center; padding: 20px 0; font-size: 14px; }

.student-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 4px;
}
.student-row:hover   { background: #f5f5f5; }
.student-row.selected { background: #e8f0fb; }

.student-info  { display: flex; align-items: center; gap: 10px; }
.student-name  { font-weight: 600; color: #333; }
.student-class { font-size: 13px; color: #888; background: #f0f0f0; padding: 2px 8px; border-radius: 4px; }

.student-actions { display: flex; align-items: center; gap: 10px; }
.student-email   { font-size: 13px; color: #aaa; }

.btn-delete {
  padding: 4px 12px;
  background: #fff0f0;
  color: #c84b2f;
  border: 1px solid #ffcdd2;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.btn-delete:hover { background: #c84b2f; color: white; }
</style>
