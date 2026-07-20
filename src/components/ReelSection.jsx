import React from 'react'
import { useTranslation } from 'react-i18next'

export function ReelSection() {
  const { t } = useTranslation()
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const sectionRef = React.useRef(null)

  React.useEffect(() => {
    const currentRef = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    if (currentRef) {
      observer.observe(currentRef)
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section 
      id="reel" 
      ref={sectionRef} 
      className="bg-black py-24 w-full border-t border-border/20 relative overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes draw-graph-line {
          0% { stroke-dashoffset: 200; }
          45% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes fade-area {
          0%, 100% { opacity: 0; }
          45%, 85% { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.8); opacity: 0.9; }
        }
        .graph-line {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          transition: opacity 0.5s ease;
        }
        .active .graph-line {
          animation: draw-graph-line 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .graph-area {
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        .active .graph-area {
          animation: fade-area 6s ease-in-out infinite;
        }
        .glow-dot {
          opacity: 0;
          transform-origin: 100px 5px;
          transition: opacity 0.5s ease;
        }
        .active .glow-dot {
          animation: pulse-glow 2s infinite ease-in-out;
        }
        .grid-bg {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px);
        }
      `}} />

      {/* Graph Background Animation */}
      <div className={`absolute inset-0 grid-bg opacity-80 pointer-events-none select-none ${isIntersecting ? 'active' : ''}`}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="graphGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="1.0" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          
          {/* Area under the graph line */}
          <path 
            d="M 0,100 L 0,95 Q 25,90 50,60 T 100,5 L 100,100 Z" 
            fill="url(#areaGradient)"
            className="graph-area"
          />

          {/* Main rising line */}
          <path 
            d="M 0,95 Q 25,90 50,60 T 100,5" 
            fill="none" 
            stroke="url(#graphGradient)" 
            strokeWidth="1.2" 
            className="graph-line"
          />

          {/* Glowing indicator dot at peak */}
          <g className="glow-dot">
            <circle cx="100" cy="5" r="3" fill="#10B981" opacity="0.6" />
            <circle cx="100" cy="5" r="1" fill="#10B981" />
          </g>
        </svg>
      </div>

      {/* Dark Vignette Overlay for smooth top/bottom black transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Autoplay Video */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[560px] aspect-[4/3] overflow-hidden border border-border/40 bg-surface-light">
              <video 
                src="/videos/reel.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              {/* Subtle visual gradient edge mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none" />
            </div>
          </div>

          {/* Right: Text Box */}
          <div className="w-full lg:w-1/2 flex justify-start">
            <div className="w-full bg-zinc-900/30 border border-border/40 p-8 sm:p-12 relative overflow-hidden text-left">
              {/* Corner accent line */}
              <div className="absolute top-0 left-0 w-2 h-[1px] bg-accent" />
              <div className="absolute top-0 left-0 w-[1px] h-2 bg-accent" />
              
              <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-accent mb-6 leading-none">
                {t('reel.title', 'Showcase')}
              </h2>
              <p className="font-body font-normal text-white text-sm sm:text-base leading-relaxed tracking-wide">
                {t('reel.description', 'Showcase details will be written here. Bu hissədə nümayiş etdiriləcək mətn daha sonra əlavə olunacaq.')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
