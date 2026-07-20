import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook to dynamically manage SEO meta tags for Vite Single Page Applications (SPA).
 * Updates document title, description, keywords, and Open Graph/Twitter tags.
 * 
 * @param {Object} seoConfig
 * @param {string} seoConfig.title - The page title
 * @param {string} seoConfig.description - The page description
 * @param {string} seoConfig.keywords - Comma-separated keyword list
 * @param {string} seoConfig.image - Image URL for social preview sharing
 * @param {string} seoConfig.url - Canonical URL of the page
 */
export function useSEO({ title, description, keywords, image, url }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    // 0. Sync HTML element lang attribute with active localization language
    if (i18n?.language) {
      document.documentElement.lang = i18n.language
    }

    // 1. Update Title
    if (title) {
      document.title = title
    }

    // 2. Helper to update/create meta tag
    const updateMetaTag = (name, property, content) => {
      if (content === undefined || content === null) return
      
      const selector = name 
        ? `meta[name="${name}"]` 
        : `meta[property="${property}"]`
      
      let el = document.querySelector(selector)
      
      if (!el) {
        el = document.createElement('meta')
        if (name) el.setAttribute('name', name)
        if (property) el.setAttribute('property', property)
        document.head.appendChild(el)
      }
      
      el.setAttribute('content', content)
    }

    // 3. Update primary tags
    updateMetaTag('description', null, description)
    updateMetaTag('keywords', null, keywords)

    // 4. Update Open Graph (og:) tags
    updateMetaTag(null, 'og:title', title)
    updateMetaTag(null, 'og:description', description)
    updateMetaTag(null, 'og:image', image)
    updateMetaTag(null, 'og:url', url || window.location.href)

    // 5. Update Twitter tags
    updateMetaTag('twitter:title', null, title)
    updateMetaTag('twitter:description', null, description)
    updateMetaTag('twitter:image', null, image)
  }, [title, description, keywords, image, url])
}
