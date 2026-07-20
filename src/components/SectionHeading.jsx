import React from 'react'

export function SectionHeading({ title, subtitle, titleClassName }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center my-16 animate-fade-up">
      <h2 className={`font-heading text-5xl md:text-7xl uppercase tracking-tighter text-white ${titleClassName || 'font-extrabold'}`}>
        {title}.
      </h2>
      {subtitle && (
        <span className="font-heading font-semibold text-xs tracking-widest text-accent uppercase">
          {subtitle}
        </span>
      )}
    </div>
  )
}
