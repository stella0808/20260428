// src/api/sheets.js
import axios from 'axios'

// ⚠️ 把這裡換成你的 Apps Script 部署 URL
const API_URL = 'https://script.google.com/macros/s/AKfycbynmvf7Ro3TBph8163kYx2DyozizMvb1N2Me4n9Bj0ui2RlwcWy7dI_Nt1kJWs02A-vHQ/exec'

// 建立 axios 實例
const api = axios.create({
  // Google Apps Script 的 CORS 限制，需要這個設定
  headers: { 'Content-Type': 'text/plain' }
})

// ── 學生相關 API ──────────────────────────────────

// 取得所有學生
export async function getStudents() {
  const res = await api.get(`${API_URL}?action=getStudents`)
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}

// 新增學生
export async function addStudent(studentData) {
  const res = await api.post(API_URL, {
    action: 'addStudent',
    ...studentData
  })
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}

// 刪除學生
export async function deleteStudent(id) {
  const res = await api.post(API_URL, {
    action: 'deleteStudent',
    id: id
  })
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}

// ── 成績相關 API ──────────────────────────────────

// 取得成績（可傳入 student_id 篩選）
export async function getScores(studentId = null) {
  const url = studentId
    ? `${API_URL}?action=getScores&student_id=${studentId}`
    : `${API_URL}?action=getScores`
  const res = await api.get(url)
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}

// 新增成績
export async function addScore(scoreData) {
  const res = await api.post(API_URL, {
    action: 'addScore',
    ...scoreData
  })
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}

// 更新成績
export async function updateScore(id, newScore) {
  const res = await api.post(API_URL, {
    action: 'updateScore',
    id: id,
    score: newScore
  })
  if (!res.data.success) throw new Error(res.data.error)
  return res.data.data
}
