import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Custom hook to dynamically manage SEO meta tags for Vite Single Page Applications (SPA).
 * Updates document title, description, keywords, canonical URL, Open Graph, Twitter tags, and JSON-LD structured data.
 * 
 * @param {Object} seoConfig
 * @param {string} seoConfig.title - The page title
 * @param {string} seoConfig.description - The page description
 * @param {string} seoConfig.keywords - Comma-separated keyword list
 * @param {string} seoConfig.image - Image URL for social preview sharing
 * @param {string} seoConfig.url - Canonical URL of the page
 * @param {Object} [seoConfig.jsonLd] - Optional JSON-LD structured data object
 */
export function useSEO({ title, description, keywords, image, url, jsonLd }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    const currentLang = i18n?.language || 'az'

    // 0. Sync HTML element lang attribute with active localization language
    document.documentElement.lang = currentLang

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

    // 3. Helper to update/create canonical link tag
    const updateCanonical = (canonicalUrl) => {
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
      }
      el.setAttribute('href', canonicalUrl)
    }

    const currentUrl = url || window.location.href.split('?')[0].split('#')[0]
    updateCanonical(currentUrl)

    // 4. Update primary tags
    updateMetaTag('description', null, description)
    updateMetaTag('keywords', null, keywords)
    updateMetaTag('robots', null, 'index, follow')

    // 5. Update Open Graph (og:) tags
    const localeMap = { az: 'az_AZ', en: 'en_US', ru: 'ru_RU' }
    updateMetaTag(null, 'og:locale', localeMap[currentLang] || 'az_AZ')
    updateMetaTag(null, 'og:site_name', 'Mirkazim Media')
    updateMetaTag(null, 'og:title', title)
    updateMetaTag(null, 'og:description', description)
    updateMetaTag(null, 'og:image', image || 'https://mirkazim.media/images/profile-about.webp')
    updateMetaTag(null, 'og:url', currentUrl)

    // 6. Update Twitter tags
    updateMetaTag('twitter:card', null, 'summary_large_image')
    updateMetaTag('twitter:title', null, title)
    updateMetaTag('twitter:description', null, description)
    updateMetaTag('twitter:image', null, image || 'https://mirkazim.media/images/profile-about.webp')

    // 7. Dynamic JSON-LD injection
    let jsonLdScript = document.getElementById('dynamic-seo-jsonld')
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script')
        jsonLdScript.id = 'dynamic-seo-jsonld'
        jsonLdScript.type = 'application/ld+json'
        document.head.appendChild(jsonLdScript)
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd)
    } else if (jsonLdScript) {
      jsonLdScript.remove()
    }
  }, [title, description, keywords, image, url, jsonLd, i18n?.language])
}

