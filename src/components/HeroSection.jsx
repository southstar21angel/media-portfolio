import React from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function HeroSection({ showIntro = false }) {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen w-full bg-black overflow-hidden flex items-end p-8 md:p-16">
      {/* Background Image */}
      <div 
        className={`absolute inset-0 bg-cover bg-[80%_center] md:bg-center opacity-40 transition-all duration-[6000ms] ease-out ${
          showIntro ? 'scale-110' : 'scale-100'
        }`}
        style={{ backgroundImage: `url('/images/hero-bg.png')` }}
      />
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/10" />

      {/* Navigation links in Hero (Absolute top-left, under navbar) */}
      <nav 
        className={`absolute top-24 left-8 md:left-16 z-20 flex flex-col gap-3 items-start transition-all duration-1000 ${
          showIntro ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <Link 
          to="/" 
          hash="about"
          className="font-heading font-semibold text-xl sm:text-1xl tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300 uppercase relative group w-fit"
        >
          {t('about.title', 'Haqqımda')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/works" 
          className="font-heading font-semibold text-xl sm:text-1xl tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300 uppercase relative group w-fit"
        >
          {t('nav.works', 'İşlər')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link 
          to="/" 
          hash="contact"
          className="font-heading font-semibold text-xl sm:text-1xl tracking-wider text-muted-foreground hover:text-accent transition-colors duration-300 uppercase relative group w-fit"
        >
          {t('nav.contact', 'Əlaqə')}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </nav>

      {/* Text Details over image */}
      <div 
        className={`relative z-10 text-left max-w-2xl transition-all duration-[1200ms] ease-out ${
          showIntro ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}
      >
        <h1 className="font-heading font-semibold text-6xl sm:text-5xl md:text-8xl tracking-tighter text-white leading-none mb-4">
          {t('hero.motto', 'Mirkazim.')}
        </h1>
        <h1 className="font-heading font-medium text-6xl sm:text-5xl md:text-7xl tracking-tighter text-accent  leading-none mb-4">
          {t('hero.media', 'Media.')}
        </h1>
        <div className="text-muted-foreground text-[10px] tracking-widest uppercase font-heading">
          {t('hero.tagline', 'Videoqrafiya')} &bull; 2026
        </div>
      </div>
      {/* Floating Instagram Link in Hero Bottom Right */}
      <div 
        className={`absolute bottom-8 right-8 md:bottom-16 md:right-16 z-20 transition-all duration-1000 ${
          showIntro ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <a 
          href="https://instagram.com/mirkazim.media" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-heading font-semibold text-xs tracking-widest text-muted-foreground hover:text-accent transition-colors duration-300 uppercase flex items-center gap-2"
        >
          <svg className="size-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
          Instagram
        </a>
      </div>
    </section>
  )
}
