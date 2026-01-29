/**
 * 把 DatePicker + TimePicker 的值組合成 LocalDateTime 格式字串
 * @param {string[]} dateRange - ["YYYY-MM-DD", "YYYY-MM-DD"]
 * @param {string[]} timeRange - ["HH:mm:ss", "HH:mm:ss"]
 * @returns {{ start: string, end: string }}
 */
export function formatDateTimeRange(dateRange, timeRange) {
  if (!dateRange || !timeRange || dateRange.length < 2 || timeRange.length < 2) {
    return { start: null, end: null }
  }

  const start = `${dateRange[0]}T${timeRange[0]}`
  const end = `${dateRange[1]}T${timeRange[1]}`
  return { start, end }
}

/**
 * 格式化日期時間 (yyyy/MM/dd HH:mm:ss)
 * @param {string|Date} value - ISO字串或Date物件
 * @returns {string}
 */
export function formatDateTime(value) {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (isNaN(date.getTime())) return value // 如果不是合法時間就直接回傳原值

  const pad = (n) => (n < 10 ? '0' + n : n)

  return (
    date.getFullYear() +
    '/' +
    pad(date.getMonth() + 1) +
    '/' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  )
}
