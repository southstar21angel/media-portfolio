import i18n from '../i18n'

export const localize = (obj, field) => {
  if (!obj) return ''
  const lang = i18n.language || 'az'
  // Support both localized database columns (e.g. title_az, title_ru) 
  // and object-based localization if needed
  return obj[`${field}_${lang}`] || obj[`${field}_az`] || obj[field] || ''
}
