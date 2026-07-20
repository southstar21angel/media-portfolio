import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Mail, MapPin, Phone } from 'lucide-react'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ReelSection } from '@/components/ReelSection'
import { WorksPreview } from '@/components/WorksPreview'
import { SectionHeading } from '@/components/SectionHeading'
import { Logo } from '@/components/Logo'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { t } = useTranslation()
  const [showSplash, setShowSplash] = React.useState(() => {
    return !sessionStorage.getItem('mirkazim_logo_intro')
  })
  const [fadeSplash, setFadeSplash] = React.useState(false)

  React.useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden'
      const fadeTimer = setTimeout(() => {
        setFadeSplash(true)
      }, 3600)

      const removeTimer = setTimeout(() => {
        setShowSplash(false)
        document.body.style.overflow = ''
        sessionStorage.setItem('mirkazim_logo_intro', 'true')
      }, 4400)

      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(removeTimer)
        document.body.style.overflow = ''
      }
    }
  }, [showSplash])

  return (
    <div className="w-full">
      {showSplash && (
        <>
          {/* Black background overlay that fades out */}
          <div 
            className={`fixed inset-0 z-[99] bg-black transition-opacity duration-[800ms] ease-in-out select-none pointer-events-none ${
              fadeSplash ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Logo container that morphs to navbar */}
          <div 
            className={`fixed z-[100] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[800ms] ease-in-out flex items-center justify-center ${
              fadeSplash 
                ? 'top-8 size-20' 
                : 'top-1/2 size-48 sm:size-64'
            }`}
          >
            <Logo className="w-full h-full" animate={true} />
          </div>
        </>
      )}

      {/* Hero split-screen */}
      <HeroSection showIntro={showSplash && !fadeSplash} />

      {/* About Section */}
      <AboutSection />

      {/* Reel Section */}
      <ReelSection />

      {/* Featured works preview */}
      <WorksPreview />

      {/* Contact Section */}
      <section id="contact" className="bg-black py-24 border-t border-border/40 scroll-mt-16 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          <SectionHeading title={t('contact.title')} subtitle={t('contact.cta')} titleClassName="font-semibold" />

          <div className="flex flex-col items-center gap-12 mt-8 text-center animate-fade-up max-w-2xl">
            {/* Giant WhatsApp Phone CTA */}
            <a 
              href="tel:+994559800959" 
              className="font-heading font-semibold text-3xl sm:text-5xl md:text-6xl text-white hover:text-emerald-400 tracking-tighter transition-all duration-300 break-all leading-none"
            >
              055 980 09 59
            </a>

            {/* Sub details */}
            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center text-muted-foreground font-heading font-medium text-xs tracking-widest uppercase mt-4">
              <a 
                href="https://wa.me/994559800959" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="size-4 text-emerald-500 fill-emerald-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.162.946 11.535.946c-5.438 0-9.863 4.372-9.868 9.8.001 1.729.46 3.417 1.332 4.93L2.016 22.1l6.757-1.769c-1.597.87-3.125 1.258-4.71 1.258z"/>
                  <path d="M17.487 14.417c-.3-.15-1.77-.874-2.043-.974-.275-.1-.475-.15-.675.15-.2.3-.77.974-.944 1.174-.175.2-.35.225-.65.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.589-.491-.51-.675-.52-.174-.01-.374-.012-.574-.012s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.11 3.224 5.112 4.525.715.31 1.273.495 1.71.635.717.228 1.368.196 1.883.12.574-.085 1.77-.724 2.02-1.425.25-.7.25-1.3 0-1.425-.075-.15-.275-.225-.575-.375z"/>
                </svg>
                WhatsApp Chat
              </a>
              <a 
                href="https://instagram.com/mirkazim.media" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-pink-500 transition-colors duration-300 whitespace-nowrap"
              >
                <svg className="size-4 text-pink-500 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
              <a href="mailto:info@mirkazim.media" className="flex items-center gap-2 hover:text-white transition-colors duration-300 whitespace-nowrap">
                <Mail className="size-4 text-accent" />
                info@mirkazim.media
              </a>
              <span className="flex items-center gap-2 whitespace-nowrap">
                <MapPin className="size-4 text-accent" />
                {t('contact.location')}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
