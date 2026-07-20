import React from 'react'
import { useTranslation } from 'react-i18next'


export function AboutSection() {
  const { t } = useTranslation()

  return (
    <section id="about" className="relative bg-black py-24 w-full border-t border-border/20 overflow-hidden min-h-[50vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url('/images/bg-about.webp')` }}
      />
      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Bio Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <h2 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-accent mb-6 leading-none">
              {t('about.title', 'Haqqımda')}
            </h2>
            <p className="font-body font-normal text-white text-sm sm:text-base leading-relaxed tracking-wide max-w-xl">
              {t('about.bio', 'Salam, mən Mirkazim. Vizual hekayələr çərçivəsində filmlər, reklam çarxları və rejissorluq işləri görürəm.')}
            </p>
          </div>

          {/* Right: Circular Profile Picture wrapper */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative group w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border border-border/40 bg-surface-light aspect-square">
              {/* Image zoom effect */}
              <img 
                src="/images/profile-about.webp" 
                alt="Mirkazim" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 rounded-full"
                loading="lazy"
              />
              {/* Subtle inner overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-35 transition-opacity duration-500 rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
