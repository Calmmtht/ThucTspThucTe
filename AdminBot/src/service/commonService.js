const timezone7 = 7 * 60 * 60 * 1000 //ms

export const getISOStringNow = () => {
  const time = new Date().getTime() + timezone7
  return new Date(time).toISOString()
}

export const getISOString = (date) => {
  const time = new Date(date).getTime() + timezone7
  return new Date(time).toISOString()
}

export const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN')

export const formatDateTime = (date) => new Date(date).toLocaleString('vi-VN')

export const formatVND = (value) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
